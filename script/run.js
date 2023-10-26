window.onload = () => {
    $("#uc").keypress((event) => {
        if (event.key == "Enter") {
            document.getElementById("btnClick").click();
        }
    })
}

window.showNotification = (type, message) => {
        const notifierBox = document.getElementById("notifier-box");

        let transitionsEnded = 0;
        const notification = document.createElement("div");
        notification.className = "notification";

        if (type === "done") notification.style.backgroundColor = "#0c0";
        else if (type === "error") notification.style.backgroundColor = "#c00";
        else if (type === "load") notification.style.backgroundColor = "#00aaff";

        const msg = document.createElement("span");
        msg.className = "message";
        msg.innerHTML = message;

        notification.appendChild(msg);
        notifierBox.appendChild(notification);

        setTimeout(() => {
            notification.style.visibility = "visible";
            notification.setAttribute("data-show", true);
        }, 10)

        setTimeout(() => {
            notification.setAttribute("data-show", false);
            notification.addEventListener("transitionend", () => {
                transitionsEnded++;
                if (transitionsEnded == 2) notifierBox.removeChild(notification);
            });
        }, 1500)
    }

async function buscarQtde() {
	const UC = document.getElementById("uc").value;
    document.getElementById("res").style.opacity = 0;
	
	if (UC == "") {
		window.showNotification("error","Campo vazio");
	} else {
        window.showNotification("load","Buscando...");
		let data = await fetch("/data" + UC);
		data = await data.json();
        console.log(data)
        if (data[0] == "undefined") {
            window.showNotification("error","Nada encontrado!");
            return;
        }

        document.getElementById("res").style.opacity = 1;
        document.getElementById("pos").innerHTML = "Posição - " + data[0][Object.keys(data[0])[1]];
        document.getElementById("lm").innerHTML = "Produto   - " + data[0][Object.keys(data[0])[2]];
        document.getElementById("lote").innerHTML = "Lote - " + data[0][Object.keys(data[0])[3]];
        document.getElementById("desc").innerHTML = "Descrição - " + data[0][Object.keys(data[0])[7]];
        document.getElementById("qtd").innerHTML = "Quantidade - " + data[0][Object.keys(data[0])[5]] + " " + data[0][Object.keys(data[0])[6]];
        document.getElementById("typeDep").innerHTML = "Tipo de depósito - " + data[0][Object.keys(data[0])[0]];
        document.getElementById("ucc").innerHTML = "Unidade Comercial - " + data[0][Object.keys(data[0])[4]];
        window.showNotification("done","Encontrado");
	}
}