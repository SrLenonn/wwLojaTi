<script>
    import {onMount} from 'svelte'
    import Footer from '../../components/Footer.svelte';
    import { auth, db, storage} from '../../lib/firebase/firebase'
    import { authHandlers, authStore } from "../../store/store";
    import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
    import { getDoc, doc, setDoc, getDocs, collection, addDoc } from 'firebase/firestore'

    let dados = [];
    let productList = []
    let productToAdd = []

    let name = ''
    let description = ''
    let price = ''
    let amountToChose = false
    let amount = 1
    let mode = 1


    authStore.subscribe(curr => {
        productList = curr.data.cart
    })

    onMount(async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        dados = querySnapshot.docs.map(doc => doc.data());
    });

    async function addProductToMenu(name, description, price) {
    try {

        const imageUrl = await getDownloadURL(snapshot.ref);
        console.log(name, description, price)
        console.log(imageUrl)
        const dataToSetToStore = {
            nome: name,
            descricao: description,
            preco: price, 
        };

        await addDoc(collection(db, 'products'), dataToSetToStore);

        console.log('Produto adicionado com sucesso!');
        location.reload();
    } catch (error) {
        console.error('Erro ao adicionar o produto:', error);
        }
    }

    async function saveCart(product) {
    const productObj = {
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        quantidade: amount
    };
    productList = [...productList, productObj];
    try {
        const userRef = doc(db, 'users', $authStore.user.uid)
        await setDoc(userRef, { cart: productList }, { merge: true })
    } catch (err) {
        console.log("There was an error saving your information: " + err)
    }

    productToAdd = [];
    amount = 1;
    amountToChose = false;
}

    function choseAmount(index) {
        productToAdd = index
        amountToChose = true
    }

</script>
<div class="mainContainer">
    <div class="headerContainer">
        <h1>Home</h1>
        <div class="headerBtns">
            <button on:click={() => window.location.href = "/cart"}>Carrinho</button>
            <button on:click={authHandlers.logout}>Sair</button>
            {#if mode} 
                <button on:click={() => mode = 0}>Adicionar produto</button>
            {:else}
                <button on:click={() => mode = 1}>Menu</button>
            {/if}
        </div>
    </div>
    {#if mode}
    {#each dados as dado, index}
        <div class="listProduct">
            <div class="product">
                <h2>{dados[index].nome}</h2>
                <p>{dados[index].descricao}</p>
                <p>{dados[index].preco} R$</p>
            </div>
            <div class="economics">
                <button on:click={() => choseAmount(dados[index])}>Adicionar ao carrinho</button>
            </div>
        </div>
    {/each}
    {:else}
    <h2>Escreva as informações do produto a serem adicionadas</h2>
    <form>
        <input type="text" bind:value={name} required placeholder="Nome do produto">
        <input type="text" bind:value={description} required placeholder="Descrição do produto">
        <input type="number" bind:value={price} required placeholder="Preço do produto">
        <button type="button" on:click={() => addProductToMenu(name, description, price)}>Adicionar produto a loja</button>
    </form>
    {/if}
</div>
{#if amountToChose}
        <div class="pop-up-quantity">
            <div class="pop-up">
                <h2>Selecione a quantidade do produto que você deseja adicionar</h2>
                <div>
                    <p>{productToAdd.nome}</p>
                    <p>{productToAdd.descricao}</p>
                    <p>R$ {productToAdd.preco}</p>
                </div>
                <div class="amount">
                    <i class="fa-solid fa-minus" aria-hidden="true" on:click={() => amount = Math.max(1, amount - 1)}></i>
                    <p>{amount}</p>
                    <i class="fa-solid fa-plus" aria-hidden="true" on:click={() => amount++}></i>
                </div>
                <button on:click={() => saveCart(productToAdd)}>Confirmar</button>
            </div>
        </div>
    {/if}
    <Footer/>
<style>
    .mainContainer {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        gap: 24px;
        padding: 24px;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
    }

    .headerContainer{
        background: white;
        color:black;
        padding: 10px;
        border-radius: 20px;
    }

    .headerContainer, .listProduct {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .listProduct {
        padding-bottom: 10px;
    }

    .headerBtns {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .product {
        background:white;
        color:black;
        padding: 10px;
        width: 80%;
        border-radius:20px;
    }

    button {
        background:  #EB7B00;
        color: white;
        padding: 10px 18px;
        border: none;
        border-radius: 20px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    button:hover, .amount i:hover {
        opacity: 0.7;
    }

    form {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        gap: 24px;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
    }

    input {
        height: 40px;
        border: none;
        border-radius: 4px;
    }

    .amount {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .amount i {
        padding: 10px;
        background: #003c5b;
        border-radius: 50%;
    }

    .amount p {
        padding: 0 10px;
    }
 
    .pop-up-quantity {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100vh;
        background-color: #EB7B00;
    }
    .pop-up {
        background:white;
        color:black;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        background-color: #EB7B00;
        border-radius: 4px;
        text-align: center;
        width: 30%;
        height: 70%;
        padding: 20px;
    }
</style>