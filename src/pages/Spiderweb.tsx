import React from 'react';
import PoissonDiskSampling from 'poisson-disk-sampling';
import colors from "tailwindcss/colors";


class Spiderweb extends React.Component {
    componentDidMount() {
        this.drawWeb();
    }

    drawWeb() {
        const canvas = document.getElementById("cvs")! as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!

        ctx.fillStyle = this.createWebPattern(ctx, canvas)!;

        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    createWebPattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        const p = new PoissonDiskSampling({
            shape: [canvas.width, canvas.height],
            minDistance: 100,
            maxDistance: 115,
            tries: 10
        });
        const pts = p.fill()

        pts.forEach(pt => {
            this.hexagon(ctx, pt[0], pt[1]);
        });

        // Create a repeating pattern from the spiderweb
        return ctx.createPattern(canvas, 'repeat');
    }

    hexagon(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const numberOfSides = this.randomIntFromInterval(6, 8), size = this.randomIntFromInterval(15, 50);

        ctx.beginPath();
        ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
        for (let i = 1; i <= numberOfSides; i += 1) {
            ctx.lineTo(x + size * Math.cos(i * 2 * Math.PI / numberOfSides), y + size * Math.sin(i * 2 * Math.PI / numberOfSides));
        }
        ctx.closePath();
        ctx.strokeStyle = [colors.amber["400"], colors.amber["500"], colors.amber["600"]][Math.floor(Math.random() * 3)];
        ctx.lineWidth = this.randomIntFromInterval(1, 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.stroke();
    }

    randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    render() {
        return <>
            <p>hi</p>
            <canvas id="cvs" className="pulsebg opacity-10 -z-50" width={window.innerWidth} height={window.innerHeight}/>
        </>;
    }
}

export default Spiderweb;
