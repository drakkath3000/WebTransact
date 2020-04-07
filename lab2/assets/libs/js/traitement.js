var bd;
var requete = indexedDB.open("BDinventaire", 1);
const Liste = {
    template: '#liste',
    mounted: function() {
        AfficherListe();
    }
};
const Produit = {
    template: '#produit',
    mounted: function() {
        AfficherProduit(1);
    }
};
const Ajout = { template: '#ajout' };
const Modification = { template: '#modification' };

requete.onupgradeneeded = function(event){
    var bd = event.target.result;

    var options = {
        keyPath: "noProduit",
        autoIncrement: true
    };
    var entrepot = bd.createObjectStore("MonEntrepot", options);

    entrepot.createIndex("produit", "noProduit");

    entrepot.transaction.oncomplete = function(event){
        var trans = bd.transaction("MonEntrepot", "readwrite");
        var monEntrepot = trans.objectStore("MonEntrepot");

        monEntrepot.add({
            nomProduit: "Bacon hat",
            prix: 42,
            fournisseur: "Much grease",
            description: "A cute greasy hat for your everyday life!",
            image: "assets/images/pork-hat.jpg",
            quantite: 1
        });
    };
};
//Routage
const routes = [
    { path: '*', redirect: "/liste" },
    { path: '/liste', component: Liste },
    { path: '/produits', component: Produit },
    { path: '/produits/ajout', component: Ajout },
    { path: '/modification', component: Modification }
];

const router = new VueRouter({
    routes
});

const app = new Vue({
    router
}).$mount('#app');

requete.onsuccess = function(event){
    bd = event.target.result;
};
requete.onerror = function(event){
    console.log(event.target.errorCode);
};
function AjoutProduit()
{
    var nom = document.getElementById("ajoutNom").value;
    var prix = document.getElementById("ajoutPrix").value;
    var fournisseur = document.getElementById("ajoutFournisseur").value;
    var description = document.getElementById("ajoutDescription").value;
    var image = "assets/images/" + document.getElementById("ajoutImage").files[0].name;
    var quantite = document.getElementById("ajoutQuantite").value;
    var transaction = bd.transaction(["MonEntrepot"], "readwrite");
    var monEntrepot = transaction.objectStore("MonEntrepot");
    monEntrepot.add({
        nomProduit: nom,
        prix: prix,
        fournisseur: fournisseur,
        description: description,
        image: image,
        quantite: quantite
    });
    alert("Le produit : " + nom + " à été ajouté avec succès !");
}
function ModifierProduit()
{
    //TO DO --------------------
    var transaction = bd.transaction(["MonEntrepot"], "readwrite");
    var monEntrepot = transaction.objectStore("MonEntrepot");
    monEntrepot.put({
        noProduit: 1,
        nomProduit: "Bacon hat",
        prix: 42,
        fournisseur: "Much grease",
        description: "A cute greasy hat for your everyday life!",
        image: "assets/images/pork-hat.jpg",
        quantite: 1
    });
    alert("Le produit à été modifié avec succès !");
}
function AfficherProduit(produitId)
{
    requete = indexedDB.open("BDinventaire", 1);
    requete.onsuccess = function(event)
    {
        var transaction = bd.transaction(["MonEntrepot"], "readonly");
        var monEntrepot = transaction.objectStore("MonEntrepot");
        monEntrepot.openCursor().onsuccess = function(event){
            var cursor = event.target.result;
            for (i = 1; i < produitId; i++) {
                cursor.continue();
            }
            if(cursor)
            {
                document.getElementById("nomProduit").innerHTML = cursor.value.nomProduit;
                document.getElementById("prixProduit").innerHTML = "$" + cursor.value.prix;
                document.getElementById("fournisseurProduit").innerHTML = cursor.value.fournisseur;
                document.getElementById("descriptionProduit").innerHTML = cursor.value.description;
                document.getElementById("imageProduit").src = cursor.value.image;
                document.getElementById("quantiteProduit").innerHTML = cursor.value.quantite;
            }
        }
    };
}
function AfficherListe()
{
    var transaction = bd.transaction(["MonEntrepot"], "readonly");
    var monEntrepot = transaction.objectStore("MonEntrepot");
    monEntrepot.openCursor().onsuccess = function(event)
    {
        var curseur = event.target.result;
        var produit = curseur.value;
        if(curseur)
        {
            const div = document.createElement('div');
            div.className = 'col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12';
            console.log(produit.image);
            div.innerHTML =
                '<div class="product-thumbnail">' +
                '<div class="product-img-head">' +
                '<div class="product-img">' +
                '<img src="' + produit.image + '" alt="" class="img-fluid" height="228" width="250"> ' +
                '</div>' +
                '</div>' +
                '<div class="product-content">' +
                '<div class="product-content-head">' +
                '<h3 class="product-title">' + produit.nomProduit + '</h3>' +
                '<div class="product-price">' + produit.prix +  '$</div>' +
                '</div>' +
                '<div class="product-btn">' +
                '<a href="index.html?_ijt=8b525bhcjkq66v3jtloe0v3gqp#/modification/' + produit.noProduit + '" class="btn btn-primary">Modifier</a>' +
                '<a href="index.html?_ijt=8b525bhcjkq66v3jtloe0v3gqp#/produit/' + produit.noProduit + '" class="btn btn-outline-light">Détails</a>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.getElementById('divList').appendChild(div);
            curseur.continue();
        }
    }
}
function AfficherProduitModification(produitId)
{
    var transaction = bd.transaction(["MonEntrepot"], "readwrite");
    var monEntrepot = transaction.objectStore("MonEntrepot");
    var requete = monEntrepot.get(produitId);
    requete.onsuccess = function(event){
        var value = event.target.result;
        document.getElementById("modNom").value = value.nomProduit;
        document.getElementById("modPrix").value = value.prix;
        document.getElementById("modFournisseur").value = value.fournisseur;
        document.getElementById("modDescription").innerHTML = value.description;
        document.getElementById("modImage").src = value.image;
        document.getElementById("modQuantite").value = value.quantite;
    };
}
function test()
{
    AfficherProduitModification(2);
}