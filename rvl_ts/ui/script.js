
var SelectedSlot = null
var SelectedItem = null
var Slots = null
var Inside = false
var OnGrid = false
var Basket = []
var Clicked = false

// Check Basket //

var Colour1 = false;
var Colour2 = false;

$("#list").hide();
$("#mod-list").hide();

//$("#main").hide();
$("#inside-list").hide();

window.addEventListener("message", function (event) {
  var item = event.data;
  
  if (item.action === "open") {
    $("#main").fadeIn();
    $("#list").fadeIn();
    $("#basket-qty").html("("+Basket.length+")");
    $("#source-model").html(item.model+'<span style="font-size: 0.5vw;"> ('+item.plate+')</span>');
    if (Basket.length > 0) {
      console.log(JSON.stringify(Basket))
      console.log("basket with item")
      $(".basket-empty").css("display","none");
      
    } else if (Basket === [] || Basket.length === 0) {
      console.log("basket without item")
      $(".basket-empty").css("display","block");
    }
  } else if (item.action === "hide") {
    $("#main").fadeOut();
    $("#mod-list").fadeOut(); 
    $("#list").fadeOut();
    $("#inside-list").fadeOut()
    Inside = false
  } else if (item.action === "PrimaryColour") {
    Slots = item.table
    $("#main").hide();
    Mod("PrimaryColour")
} else if (item.action === "SecondaryColour") {
  Slots = item.table
  $("#main").hide();
  Mod("SecondaryColour")
}



});


$(".mod-button").click(function () {
  if (Clicked === false) {
    Clicked = true
    setTimeout(() => {
      Clicked = false
    }, 1000);
  $(".color-index").remove();
  SelectedSlot = null
  if (this.id === "PrimaryColour-Button") {
    $.post("https://rvl_ts/callbacks", JSON.stringify({
      action: "ModSelect",
      mod: "PrimaryColour"
    }));
    
  } else if (this.id === "SecondaryColour-Button") {
    $.post("https://rvl_ts/callbacks", JSON.stringify({
      action: "ModSelect",
      mod: "SecondaryColour"
    }));
  } else if (this.id === "Colours-Button") {
    if (Inside === false) {
    $("#inside-list").fadeIn();
    Inside = true
  } else {
    $("#inside-list").hide();
    $("#mod-list").hide();
    $("#main").fadeIn();
    $(".item-area").remove();
    if (Basket.length > 0) {
      console.log("basket with item")
      $(".basket-empty").css("display","none");

      $.each(Basket, function (index, basket) {
        $("#basket-items").append('<div class="item-area" id="item-'+index+'">' +
        '<div class="item-icon"><i class="fa-solid fa-paint-roller"></i></div>' +
        '<div class="item-information">'+basket.name+' <span class="item-price">&nbsp;'+basket.price+'€</span></div>' + 
        '<div class="item-remove" id="'+basket.type+'"><i class="fa-solid fa-xmark"></i></div>' +
        '</div>');
        $("#"+basket.type+"").data('basket', basket);
        $("#"+basket.type+"").on('mouseup', function(ev){
          if(ev.which == 1) {
            SelectedItem = $(this).data("basket");
            console.log(JSON.stringify(SelectedItem))

            $("#item-"+index).remove();
            if (index > -1) { 
              Basket.splice(basket, 1);
              $("#basket-qty").html("("+Basket.length+")");
              if (Basket.length === 0) {
                Basket = []
                console.log("Basket Empty by user")
                $(".basket-empty").css("display","block");
              }
              if (basket.type === "PrimaryColour") {
                Colour1 = false 
              } else if (basket.type === "SecondaryColour") {
                Colour2 = false
              }
            }

            

            
            }
          });
         });
         $("#basket-qty").html("("+Basket.length+")");
    } else {
      console.log("basket without item")
      $(".basket-empty").css("display","block");
    }
    Inside = false
  }
  }
} else {
  console.log("wait")
}
});

$(".basket-button").click(function () {
  if (Clicked === false) {
    Clicked = true
    setTimeout(() => {
      Clicked = false
    }, 1000);
  if (this.id === "add-basket") {
  if (Basket.length === 0) {
    Basket.push(SelectedSlot);
    console.log("first item added to basket")
    } else {
      for (var i = 0; i < Basket.length; i++) {
          if (Basket[i].type === SelectedSlot.type ) {
            if (SelectedSlot.type === "PrimaryColour") {
              Colour1 = true
              console.log("PrimaryColour true")
              break;
            } else if (SelectedSlot.type === "SecondaryColour") {
                Colour2 = true 
                console.log("SecondaryColour true")
              break;
            }
          } else if (Colour1 === false || Colour2 === false) {
            Basket.push(SelectedSlot); 
            console.log(JSON.stringify(SelectedSlot))
          }
        }    
    }
  } 
} else {
  console.log("wait")
}
});





function Mod(Mod) {
  switch (Mod) {
    case 'PrimaryColour':
      $("#mod-list").hide();
      $("#mod-list").fadeIn();
      $.each(Slots, function (index, item) {
        $("#container").append('<div class="color-index" id="'+item.index+'">'+item.name+'</div>');
        $("#"+item.index+"").data('item', item);
        $("#"+item.index+"").on('mouseup', function(ev){
          if(ev.which == 1) {
            SelectedSlot = $(this).data("item");
            console.log(JSON.stringify(SelectedSlot.type))
            SenData("PrimaryColour")
            }
          });
         });
    break;
    case 'SecondaryColour':
      $("#mod-list").hide();
      $("#mod-list").fadeIn();
      $.each(Slots, function (index, item) {
        $("#container").append('<div class="color-index" id="'+item.index+'">'+item.name+'</div>');
        $("#"+item.index+"").data('item', item);
        $("#"+item.index+"").on('mouseup', function(ev){
          if(ev.which == 1) {
            SelectedSlot = $(this).data("item");
            console.log(JSON.stringify(SelectedSlot.type))
            SenData("SecondaryColour")
            }
          });
         });
    break
  }
}

function SenData(Mod) {
  switch (Mod) {
    case 'PrimaryColour':
  $.post("https://rvl_ts/callbacks", JSON.stringify({
    action: "SlotSelected",
    mod: "PrimaryColour",
    Item: SelectedSlot
  }));
  break;
  case 'SecondaryColour':
  $.post("https://rvl_ts/callbacks", JSON.stringify({
    action: "SlotSelected",
    mod: "SecondaryColour",
    Item: SelectedSlot
  }));
  break;
}

}

document.onkeyup = function (data) {
  if (data.which == 27) {
    $.post("https://rvl_ts/callbacks", JSON.stringify({
      action: "close"
    }));
    $(".color-index").remove();
    SelectedSlot = null
  }
};


