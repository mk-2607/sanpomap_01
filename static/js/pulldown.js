function viewChange(){
    console.log("おーい");
    if(document.getElementById('list')){
        console.log("はい");
        id = document.getElementById('list').value;
        console.log("はい" + id);
        if(id == 'item1'){
            document.getElementById('Box1').style.display = "";
            document.getElementById('Box2').style.display = "none";
            document.getElementById('Box3').style.display = "none";
            document.getElementById('Box4').style.display = "none";
            document.getElementById('Box5').style.display = "none";
            document.getElementById('Box6').style.display = "none";
            document.getElementById('Box7').style.display = "none";
            document.getElementById('Box8').style.display = "none";
        }else if(id == 'item2'){
            console.log("いいえ");
            document.getElementById('Box1').style.display = "none";
            document.getElementById('Box2').style.display = "";
            document.getElementById('Box3').style.display = "none";
            document.getElementById('Box4').style.display = "none";
            document.getElementById('Box5').style.display = "none";
            document.getElementById('Box6').style.display = "none";
            document.getElementById('Box7').style.display = "none";
            document.getElementById('Box8').style.display = "none";
        }
        else if(id == 'item3'){
            document.getElementById('Box1').style.display = "none";
            document.getElementById('Box2').style.display = "none";
            document.getElementById('Box3').style.display = "";
            document.getElementById('Box4').style.display = "none";
            document.getElementById('Box5').style.display = "none";
            document.getElementById('Box6').style.display = "none";
            document.getElementById('Box7').style.display = "none";
            document.getElementById('Box8').style.display = "none";
        }
        else if(id == 'item4'){
            document.getElementById('Box1').style.display = "none";
            document.getElementById('Box2').style.display = "none";
            document.getElementById('Box3').style.display = "none";
            document.getElementById('Box4').style.display = "";
            document.getElementById('Box5').style.display = "none";
            document.getElementById('Box6').style.display = "none";
            document.getElementById('Box7').style.display = "none";
            document.getElementById('Box8').style.display = "none";
        }
        else if(id == 'item5'){
            document.getElementById('Box1').style.display = "none";
            document.getElementById('Box2').style.display = "none";
            document.getElementById('Box3').style.display = "none";
            document.getElementById('Box4').style.display = "none";
            document.getElementById('Box5').style.display = "";
            document.getElementById('Box6').style.display = "none";
            document.getElementById('Box7').style.display = "none";
            document.getElementById('Box8').style.display = "none";
        }
        else if(id == 'item6'){
            document.getElementById('Box1').style.display = "none";
            document.getElementById('Box2').style.display = "none";
            document.getElementById('Box3').style.display = "none";
            document.getElementById('Box4').style.display = "none";
            document.getElementById('Box5').style.display = "none";
            document.getElementById('Box6').style.display = "";
            document.getElementById('Box7').style.display = "none";
            document.getElementById('Box8').style.display = "none";
        }
        else if(id == 'item7'){
            document.getElementById('Box1').style.display = "none";
            document.getElementById('Box2').style.display = "none";
            document.getElementById('Box3').style.display = "none";
            document.getElementById('Box4').style.display = "none";
            document.getElementById('Box5').style.display = "none";
            document.getElementById('Box6').style.display = "none";
            document.getElementById('Box7').style.display = "";
            document.getElementById('Box8').style.display = "none";
        }
        else if(id == 'item8'){
            document.getElementById('Box1').style.display = "none";
            document.getElementById('Box2').style.display = "none";
            document.getElementById('Box3').style.display = "none";
            document.getElementById('Box4').style.display = "none";
            document.getElementById('Box5').style.display = "none";
            document.getElementById('Box6').style.display = "none";
            document.getElementById('Box7').style.display = "none";
            document.getElementById('Box8').style.display = "";
        }
    }
window.onload = viewChange;
}