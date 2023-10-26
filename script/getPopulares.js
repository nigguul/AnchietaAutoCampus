document.addEventListener("DOMContentLoaded", function() {
    fetch("/getPopulares", {
        method: 'GET'
    }).then(async (props) => {
        const data = await props.json();
        console.log(data)
        const divMaster = document.getElementById('carrosel');

        data.map(props => {
            const divCars = document.createElement('div');
            divCars.className = "carroBox"
            const divPropsCars = document.createElement('div');
            divPropsCars.className = "carroProps";

            const nomeCarro = document.createElement('h1');
            nomeCarro.textContent = props.nome;
            const marca = document.createElement('p');
            marca.textContent = "Marca " + props.marca;
            const imagemCarro = document.createElement('img');
            imagemCarro.src = props.imagem;
            const valor = document.createElement('h1');
            valor.textContent = "Valor R$" + props.valor;

            const buttonComprar = document.createElement('button');
            buttonComprar.textContent = "Comprar"

            divPropsCars.appendChild(nomeCarro);
            divPropsCars.appendChild(marca);
            divPropsCars.appendChild(valor);
            divPropsCars.appendChild(buttonComprar);
        
            divCars.appendChild(imagemCarro);
            divCars.appendChild(divPropsCars)
            divMaster.appendChild(divCars);
        })
    })
});