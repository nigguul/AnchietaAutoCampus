document.addEventListener("DOMContentLoaded", function() {
    const cookies = document.cookie.split("=")[1];

    if(cookies == undefined) {
        window.location.href = "/login"
    } else {
        fetch("/getUserInfo", {
            method: 'GET',
            headers: {
                user: cookies
            }
        }).then(async (props) => {
            const data = await props.json();
            document.querySelector("#nomeUser").innerHTML = data.Nome;
        })
    }
});

function logout() {
    document.cookie = `usertk=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "/login"
}

function redirectFor(page) {
    window.location.href = page
}