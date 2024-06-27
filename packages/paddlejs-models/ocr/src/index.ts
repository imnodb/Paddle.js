import Worker from './worker';
interface DrawBoxOptions {
    canvas?: HTMLCanvasElement;
    style?: CanvasStyleOptions;
}
interface CanvasStyleOptions {
    strokeStyle?: string;
    lineWidth?: number;
    fillStyle?: string;
}
const worker = new (Worker as any)();

export async function init() {
    return new Promise((resolve) => {
        worker.addEventListener('message', async msg => {
            const {
                event,
                data
            } = msg.data;
            if (event === 'init') {
                resolve(data)
            }
        });
        worker.postMessage({
            event: 'init',
            data: {}
        });
    })
}
export async function recognize(
    image: HTMLImageElement,
    options?: DrawBoxOptions
): Promise<{
    text: any[];
    points: any;
}> {
    return new Promise((resolve) => {
        worker.addEventListener('message', async msg => {
            const {
                event,
                data
            } = msg.data;
            if (event === 'recognize') {
                resolve(data)
                if (options.canvas) {
                    options.canvas.width = data.img.width
                    options.canvas.height = data.img.height
                    options.canvas.getContext('2d').drawImage(data.img, 0, 0)
                }
            }
        });
        createImageBitmap(image, 0, 0, image.naturalWidth, image.naturalHeight)
            .then(image => {
                worker.postMessage({
                    event: 'recognize',
                    data: {
                        image,
                        canvasOutput: !!options.canvas
                    }
                }, [image]);
            });
    })
}
