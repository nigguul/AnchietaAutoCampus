function to_do1(a,b) {
    return a+b
}

function to_do2(a,b) {
    if (a>b) 
        return a
    else
        return b
}

function to_do3(a,b) {
    var temp_a = a*a
    var temp_b = b*b

    return temp_a * temp_b
}

let valor1 = 5
let valor2 = 3

x = to_do1(valor1, valor2);
y = to_do2(valor1, valor2);
z = to_do3(x,y);

console.log(z);