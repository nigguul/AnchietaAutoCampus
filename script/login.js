async function Login() {
    document.querySelector(".pErro").innerHTML = "";
    const user = document.querySelector("#user")?.value;
    const passwd = document.querySelector("#passwd")?.value;

    if (user == "" || passwd == "") {
        document.querySelector(".pErro").innerHTML = "Todos os campos são obrigatórios";
    } else {
        fetch("/logon", {
            method: 'POST',
            headers: {
                user,
                passwd
            }
        }).then(props => {
            console.log(props.status);
            if (props.status == 401) {
                document.querySelector(".pErro").innerHTML = "Usuário inexistente.";
            } else if (props.status == 402) {
                document.querySelector(".pErro").innerHTML = "Senha incorreta.";
            } else if (props.status == 200) {
                window.location.href = "/"
            }
        })
    }
}

async function CreateUser() {
    document.querySelector(".pErro").innerHTML = "";
    const email = document.querySelector("#email")?.value;
    const passwd = document.querySelector("#passwd")?.value;
    const nome = document.querySelector("#nome")?.value;
    const address = document.querySelector("#address")?.value;

    if (email == "" || passwd == "" || nome == "" || address == "") {
        document.querySelector(".pErro").innerHTML = "Todos os campos são obrigatórios";
    } else {
        const senhaComplexa = await checkPasswd(passwd)
        const emailOk = await checkEmail(email);

        if(senhaComplexa == false) {
            document.querySelector(".pErro").innerHTML = "A senha tem que ser complexa, contendo no mínimo 8 caracteres, uma letra maiúscula e minúscula, números e caractere especial";
        } else if (emailOk == false) {
            window.showNotification("erro","E-mail inválido.");
        } else {
            fetch("/checkUserForCreate", {
                method: 'POST',
                headers: {
                    email,
                    passwd,
                    nome,
                    address
                }
            }).then(props => {
                console.log(props.status);
                if (props.status == 401) {
                    window.showNotification("erro","Usuário existente.");
                } else if (props.status == 200) {
                    window.showNotification("done","Usuário criado.");
                }
            })
        }
    }
}

async function redirectCreateUser() {
    window.location.href = "/createuser"
}

async function checkPasswd(passwd) {
    if (passwd.length < 8) {
        return false;
    }
    if (!/[A-Z]/.test(passwd)) {
        return false;
    }
    if (!/[a-z]/.test(passwd)) {
        return false;
    }
    if (!/[0-9]/.test(passwd)) {
        return false;
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(passwd)) {
        return false;
    }
    return true
}

async function checkEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
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