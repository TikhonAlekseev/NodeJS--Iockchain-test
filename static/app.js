const form = document.querySelector('.auth-form')
const btnBalance = document.getElementById('btn_balance')
const btnAmountAdd = document.getElementById('btn_pay')
const balance = document.getElementById('balance_field')
const input = form.querySelector('input') 
const userInterface = document.querySelector('.data_user')
const regist = document.querySelector('.regist')
const btnRegist = document.getElementById('btnRegist')
let isClickAdd = false
const interval = 60*10*1000



btnRegist.addEventListener('click',async function(){
    const userCreate = await axios.get('/register')
    regist.innerHTML = ""
    if(!userCreate.data.createdUser){
        const html = `
        <span class="title-regist">Ваш уникальный ключ:${userCreate.data.key}</span>
            <h6>Запомните его</h6>`
        regist.insertAdjacentHTML('beforeend' , html)
    }else if(userCreate.data.createdUser){
        const html = `
            <h3>У вас уже есть уникальный ключ</h3>`
        
        regist.insertAdjacentHTML('beforeend' , html)
    }
})

form.addEventListener('submit' ,async e =>{
    try{
        e.preventDefault()
        const data = {key:input.value}
        const response = await axios.post('/login' , data);
        if(response.data.login){
            regist.innerHTML = ""
            userInterface.style.display = "block"
        }
    }catch (err){
        throw err
    }
})

btnAmountAdd.addEventListener('click' , async function(){
    await axios.post('/faucet' , {key:isClickAdd})
    isClickAdd = true
    setTimeout(function(){
        isClickAdd = false
    },interval)
    const data = await axios.get('/info')
    balance.innerHTML = `Ваш баланс : ${data.data}`
    
})

btnBalance.addEventListener('click' , async function(){
    const data = await axios.get('/info')
    balance.innerHTML = `Ваш баланс : ${data.data}`
})
