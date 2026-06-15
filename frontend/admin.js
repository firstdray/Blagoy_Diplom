async function login() {
    const login = document.getElementById('login').value
    const password = document.getElementById('password').value

    if(!login || !password){
        alert('не все поля заполнены')
        return
    }
    try{
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                login: login,
                password: password
            })
        })
        const result = await res.json()
        if(res.ok){
          localStorage.setItem('sessionId', result.sessionId)
          window.location.href = '/adminpanel'
        }else{
            console.log(result.error)
        }
    }catch(error){
        console.error(error)
    }
}