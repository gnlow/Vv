import Spline from "./cubic-spline";
import sample from "./sample/girl.json";

//const spline = new Spline([1, 5, 10, 25, 50, 75, 90, 95, 99], [1482, 1506, 1525, 1560, 1592, 1620, 1650, 1674, 1700]);

//console.log(spline.at(62.5))

interface Collectable<T> {
    sample: (data: Data) => T;
}

interface Data {
    [key: string]: any;
}

class Catcher<T> {
    target: Data;
    collector: Collectable<T>;
    constructor(target: Data, collector: Collectable<T>){
        this.target = target;
        this.collector = collector;
    }
    catch(data: Data = {}){
        for(var prop in this.target){
            if(this.target[prop] != data[prop]){
                return undefined;
            }
        }
        return this.collector.sample(data);
    }
}

type Gen<T> = (seed: number) => T;

class Collector<T> implements Collectable<T> {
    gen: Gen<T>;
    constructor(gen: Gen<T>){
        this.gen = gen;
    }
    sample(){
        return this.gen(Math.random());
    }
}

class Percentile extends Collector<number> {
    constructor(samples: {percentile: number, value: number}[]){
        let xs: number[] = [],
            ys: number[] = [];
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

class Property<T> {
    catchers: Catcher<T>[];
    constructor(catchers: Catcher<T>[]){
        this.catchers = catchers;
    }
    sample(data: Data = {}){
        for(var catcher of this.catchers){
            const sample = catcher.catch(data);
            if(sample){
                return sample;
            }
        }
    }
}

const name = new Property([
    new Catcher({
        birthYear: 2019,
        gender: "female",
    }, new Collection(sample))
]);


console.log(name.sample({
    birthYear: 2019,
    gender: "female",
}));