let toplamGelir = 0;


// Gelir ekleme
const gelirEkleButton = document.getElementById("gelirEkleButton");
gelirEkleButton.addEventListener("click", function(event) {
  

  const gelirEkleInput = parseFloat(document.getElementById("gelirEkleInput").value);
  
  if (isNaN(gelirEkleInput)){
    // alert("Lütfen bir değer giriniz.");
    Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Gelir Kısmı Boş Geçilemez!!!. Lütfen bir değer girin.'
      });
    return;
  }

  toplamGelir += gelirEkleInput;
  document.getElementById("toplamGelir").textContent = `: ${toplamGelir} TL`;
  document.getElementById("gelirEkleInput").value = "";
  hesaplaKalan();
});






  // Harcamaları tutmak için bir dizi oluştur
let harcamalar = [];
let toplamHarcama = 0;

// Harcama formunu dinle
const giderEkleButton = document.getElementById("giderEkleButton");
const harcamaTablosuGovde = document.getElementById("harcamaTablosuGovde");
const toplamHarcamaElement = document.getElementById("toplamHarcama");

giderEkleButton.addEventListener("click", function (event) {
  const harcamaTuru = document.getElementById("harcamaTuru").value;
  const harcamaTarihi = document.getElementById("harcamaTarihi").value;
  const harcamaTutari = document.getElementById("harcamaTutari").value;

  if (harcamaTuru === "" || harcamaTarihi === "" || harcamaTutari === "") {
    // alert("Lütfen tüm alanları doldurun.");
    Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Lütfen tüm alanları doldurun.'
      });
    return;
  }

  const harcama = {
    tur: harcamaTuru,
    tarih: harcamaTarihi,
    tutar: harcamaTutari
  };

  harcamalar.push(harcama);
  kayitEkle(harcama);
  toplamHarcama += parseFloat(harcamaTutari);
  toplamHarcamaElement.textContent = `: ${toplamHarcama} TL`;

  // Form alanlarını temizle
  harcamaForm.reset();

  // Harcamaları JSON formatında kaydet
  kaydetHarcamalar();
  hesaplaKalan();
});

// Yeni harcama kaydını tabloya ekle
function kayitEkle(harcama) {
  const satir = document.createElement("tr");

  const tarihHucre = document.createElement("td");
  tarihHucre.textContent = harcama.tarih;

  const turHucre = document.createElement("td");
  turHucre.textContent = harcama.tur;

  const tutarHucre = document.createElement("td");
  tutarHucre.textContent = harcama.tutar + " TL";

  const silHucre = document.createElement("td");
  const silIcon = document.createElement("ion-icon");
  silIcon.setAttribute("name", "trash-outline");
  silIcon.setAttribute("size", "large");
  silIcon.style.color = "red";
  silIcon.style.cursor = "pointer";
  
  silIcon.setAttribute("class", "silBtn");
  
  silHucre.appendChild(silIcon);

  satir.appendChild(tarihHucre);
  satir.appendChild(turHucre);
  satir.appendChild(tutarHucre);
  satir.appendChild(silHucre);

  harcamaTablosuGovde.appendChild(satir);
}

// Harcamaları JSON formatında kaydet
function kaydetHarcamalar() {
  const harcamalarJSON = JSON.stringify(harcamalar);
  localStorage.setItem("harcamalar", harcamalarJSON);
}

// Kaydedilmiş harcamaları tabloya yükle
function yukleHarcamalar() {
  const harcamalarJSON = localStorage.getItem("harcamalar");
  if (harcamalarJSON) {
    harcamalar = JSON.parse(harcamalarJSON);
    harcamalar.forEach(function (harcama) {
      kayitEkle(harcama);
      toplamHarcama += parseFloat(harcama.tutar);
    });
    toplamHarcamaElement.textContent = `: ${toplamHarcama} TL`;
  }
}

// Sayfa yüklendiğinde kaydedilmiş harcamaları yükle
yukleHarcamalar();
// kalan miktarı toplamı
function hesaplaKalan() {
    
    const kalan = toplamGelir - toplamHarcama;
  
    document.getElementById("kalan").textContent = `: ${kalan} TL`;
  }
  

// Silme düğmelerini seç
// const silBtnListesi = document.getElementsByClassName("silBtn");

// // Her bir silme düğmesine click olayı dinleyici ekle
// for (let i = 0; i < silBtnListesi.length; i++) {
//   silBtnListesi[i].addEventListener("click", function () {
//     // İlgili satırı bul ve sil
//     const satir = this.parentNode.parentNode;
//     satir.remove();

//     // Kalan tutarı yeniden hesapla ve güncelle
//     hesaplaKalan();
//   });
// }

const silBtns = document.getElementsByClassName("silBtn");

Array.from(silBtns).forEach(function(button) {
  button.addEventListener("click", function() {
    // Silme işlemi için gerekli kodlar...

    // Silme işleminden sonra harcamaların güncellenmiş halini localStorage'e kaydetmek
    const harcamalar = JSON.parse(localStorage.getItem("harcamalar")) || [];
    const harcamaId = this.getAttribute("data-harcama-id");

    // Silinecek harcamayı bulmak ve silmek
    const silinecekHarcama = harcamalar.find(function(harcama) {
      return harcama.id === harcamaId;
    });

    if (silinecekHarcama) {
      harcamalar.splice(harcamalar.indexOf(silinecekHarcama), 1);
    }

    // Güncellenmiş harcamaları localStorage'e kaydetmek
    localStorage.setItem("harcamalar", JSON.stringify(harcamalar));

    // Tablodan satırı kaldırmak
    const satir = this.closest("tr");
    satir.remove();
    localStorage.removeItem("harcamalar");
    
    hesaplaKalan();
    
    
  });
});

