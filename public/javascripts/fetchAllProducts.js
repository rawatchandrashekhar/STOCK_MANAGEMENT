$(document).ready(function(){
    $("#products").append($("<option>").text("-select product-"))
    $.getJSON("/admin/fetchallproducts",function(data){
        $.each(data,function(index,item){
            $("#products").append($("<option>").text(item.productname).val(item.productid))
        })
    })
})