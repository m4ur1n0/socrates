import type { PDFDocumentProxy,  } from "pdfjs-dist";
import { HighlightRegion } from "@/types/Files";


// given a loaded pdf doc proxy, and an array of 'chunk instructions'
// function returns a full array of highlight region objects whose position fields contain real bounding rects

export async function computePositionsForChunks(
    pdf : PDFDocumentProxy,
    chunks : Array<{
        id : string;
        page : number; // 0-indexed
        text : string;
    }>
): Promise<HighlightRegion[]> {

    const results : HighlightRegion[] = [];

    for (const {id, page, text} of chunks) {
        // get page proxy and text
        const pageProxy = await pdf.getPage(page + 1); // offset 0-index
        const textContent = await pageProxy.getTextContent();

        // build array of items each annotated with strnig, tr, w, h, etc.
        type ItemWithMetrics = {
            str : string;
            transform : number[]; // l = 6
            width : number;
            height : number;
        }

        const items : ItemWithMetrics[] = (textContent.items as any[]).map((item : any) => {
            return {
                str: item.str as string,
                transform : item.transform as number[],
                width: item.width as number,
                height : item.height as number
            };
        });


        // create running-text str and keep idx map from char-posiitons to item index
        let runningText = '';
        type IndexMapEntry = {start : number; end: number; itemIndex : number};
        const indexMap : IndexMapEntry[] = [];
        items.forEach((it, idx) => {
            const start = runningText.length;
            runningText += it.str;
            const end = runningText.length;
            indexMap.push({start, end, itemIndex : idx});
        });

        // find all occurrences of 'text' inside runningtext
        const matches : {startChar : number; endChar : number}[] = [];
        const lowerRt = runningText.toLowerCase();
        const lowerTarget = text.toLowerCase();

        let searchPos = 0;
        while (true) {
            const foundAt = lowerRt.indexOf(lowerTarget, searchPos);
            if (foundAt < 0) break;
            matches.push({startChar : foundAt, endChar : foundAt + lowerTarget.length});
            searchPos = foundAt + lowerTarget.length;
        }

        // for each match, determine which items it spans, then build their rectangles
        for (const {startChar, endChar } of matches) {
            const hitItems : ItemWithMetrics[] = [];
            indexMap.forEach(({start, end, itemIndex}) => {
                if (end > startChar && start < endChar) {
                    hitItems.push(items[itemIndex]);
                }
            });

            // convert each hit item into a scaled rect in pdf coord space
            const rects = hitItems.map((it) => {
                const [a, _b, _c, d, e, f] = it.transform;
                const width = it.width * a;
                const height = it.height * d;
                return {
                    x1 : e,
                    y1 : f,
                    x2 : e + width,
                    y2 : f + height,
                    width,
                    height
                };
            });

            const x1 = Math.min(...rects.map((r) => r.x1));
            const y1 = Math.min(...rects.map((r) => r.y1));
            const x2 = Math.min(...rects.map((r) => r.x2));
            const y2 = Math.min(...rects.map((r) => r.y2));
            const boundingRect = {x1, y1, x2, y2, width : x2 - x1, height : y2 - y1};


            // build the highlight regiojn
            results.push({
                id : id + '_' + startChar,
                page : page,
                text : text,
                position : {
                    pageNumber : page + 1,
                    boundingRect,
                    rects
                }
            });

        }
    }


    return results;

}