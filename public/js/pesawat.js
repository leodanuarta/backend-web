$(function (){
    var minDate = '11-11-2011';
    $("#depart").datepicker({dateFormat: 'yy-mm-dd' }).val();
    // $("#depart").datepicker(("option", "dateFormat", "yy-mm-dd" ));
//    console.log() $("#depart").datepicker( "option", "dateFormat", "yy-mm-dd" ));
    
})


// onClose: function(selectedDate){
//     $('#depart').datepicker("option", "minDate", selectedDate);
// }


// $("#return").datepicker({
    //     showAnim: "drop",
    //     numberOfMonth: 1,
//     minDate: minDate,
//     dateFormat: 'dd-mm-yyyy',
//     onClose: function(selectedDate){
    //         $('#depart').datepicker("option", "minDate", selectedDate);
//     }
// });