async function sendArq() {
    const data = await document.getElementById("fileImport").files[0].arrayBuffer()
    document.getElementById("res").innerHTML = "Arquivo sendo importado"
    fetch("/arq", {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: data
    }).then(() => {
        document.getElementById("res").innerHTML = "Sucesso"
    })
}