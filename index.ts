import Spline from "./cubic-spline";

const spline = new Spline([1, 5, 10, 25, 50, 75, 90, 95, 99], [1482, 1506, 1525, 1560, 1592, 1620, 1650, 1674, 1700]);

console.log(spline.at(62.5))