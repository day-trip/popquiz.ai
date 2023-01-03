import React, {RefObject, useCallback, useLayoutEffect, useRef} from "react";
import PoissonDiskSampling from "poisson-disk-sampling";
import colors from "tailwindcss/colors";

const PageBackground = ({theme}: {theme: string}) => {
    const ref: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>();
    //const height = useHeight();

    const randomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const hexagon = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
        const numberOfSides = randomIntFromInterval(6, 8), size = randomIntFromInterval(15, 50);

        ctx.beginPath();
        ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
        for (let i = 1; i <= numberOfSides; i += 1) {
            ctx.lineTo(x + size * Math.cos(i * 2 * Math.PI / numberOfSides), y + size * Math.sin(i * 2 * Math.PI / numberOfSides));
        }
        ctx.closePath();
        ctx.strokeStyle = [colors.amber["400"], colors.amber["500"], colors.amber["600"]][Math.floor(Math.random() * 3)];
        ctx.lineWidth = randomIntFromInterval(1, 2);
        ctx.shadowBlur = theme === "dark" ? 7 : 4;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.stroke();
    }, [theme]);

    const pattern = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const p = new PoissonDiskSampling({
            shape: [canvas.width, canvas.height],
            minDistance: 100,
            maxDistance: 115,
            tries: 10
        });
        const pts = p.fill()

        pts.forEach(pt => {
            hexagon(ctx, pt[0], pt[1]);
        });

        // Create a repeating pattern from the spiderweb
        return ctx.createPattern(canvas, 'repeat');
    }

    useLayoutEffect(() => {
        if (ref && ref.current) {
            const canvas = ref.current;
            const ctx = canvas.getContext('2d')!
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = pattern(ctx, canvas)!;

            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [ref]);

    return <div className="-z-50 absolute top-0 left-0 overflow-hidden">
        <canvas ref={ref} className="pulsebg blur-sm" width={window.innerWidth} height={window.innerHeight}/>
    </div>
}

export default PageBackground;
