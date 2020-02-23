import Spline from "./cubic-spline";

//const spline = new Spline([1, 5, 10, 25, 50, 75, 90, 95, 99], [1482, 1506, 1525, 1560, 1592, 1620, 1650, 1674, 1700]);

//console.log(spline.at(62.5))

type Gen<T> = (seed: number) => T;

class Collector<T> {
    gen: Gen<T>;
    constructor(gen: Gen<T>){
        this.gen = gen;
    }
    get value(){
        return this.gen(Math.random());
    }
}

class Percentile extends Collector<number> {
    constructor(samples: {percentile: number, value: number}[]){
        let xs = [],
            ys = [];
        samples.forEach(sample => {
            xs.push(sample.percentile);
            ys.push(sample.value);
        });
        const spline = new Spline(xs, ys);
        super(spline.at);
    }
}

class Collection<T> extends Collector<T> {
    constructor(cases: {freq: number, value: T}[]){
        let arr: {acc: number, value: T}[] = [],
            acc = 0;
        for(var {freq, value} of cases){
            acc += freq;
            arr.push({acc, value})
        }
        super(seed => {
            var i = 0;
            while(arr[i].acc < seed * acc){
                i++;
            }
            return arr[i].value;
        })
    }
}

const names = new Collection([
    {"value":"서준", "freq":2633},
    {"value":"하준", "freq":2334},
]);

console.log(names.value);