import { replaceHtml } from '../utils/util';
import { getSheetIndex } from '../methods/get';
import { isEditMode } from '../global/validate';
import tooltip from '../global/tooltip';
import { modelHTML } from './constant';
import { selectHightlightShow } from './select';
import conditionformat from './conditionformat';
import Store from '../store';

//定位
const luckysheetLocationCell = {
    createDialog: function(){
        $("#luckysheet-modal-dialog-mask").show();
        $("#luckysheet-locationCell-dialog").remove();

        let content = '<div class="listbox">'+
                        '<div class="listItem">'+
                            '<input type="radio" name="locationType" checked="checked" id="locationConstant">'+
                            '<label for="locationConstant">常量</label>'+
                            '<div class="subbox">'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="date" id="locationConstantDate">'+
                                    '<label for="locationConstantDate">日期</label>'+
                                '</div>'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="number" id="locationConstantNumber">'+
                                    '<label for="locationConstantNumber">数字</label>'+
                                '</div>'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="string" id="locationConstantString">'+
                                    '<label for="locationConstantString">字符</label>'+
                                '</div>'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="boolean" id="locationConstantBoolean">'+
                                    '<label for="locationConstantBoolean">逻辑值</label>'+
                                '</div>'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="error" id="locationConstantError">'+
                                    '<label for="locationConstantError">错误</label>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="listItem">'+
                            '<input type="radio" name="locationType" id="locationFormula">'+
                            '<label for="locationFormula">公式</label>'+
                            '<div class="subbox">'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="date" id="locationFormulaDate" disabled="true">'+
                                    '<label for="locationFormulaDate" style="color: #666">日期</label>'+
                                '</div>'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="number" id="locationFormulaNumber" disabled="true">'+
                                    '<label for="locationFormulaNumber" style="color: #666">数字</label>'+
                                '</div>'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="string" id="locationFormulaString" disabled="true">'+
                                    '<label for="locationFormulaString" style="color: #666">字符</label>'+
                                '</div>'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="boolean" id="locationFormulaBoolean" disabled="true">'+
                                    '<label for="locationFormulaBoolean" style="color: #666">逻辑值</label>'+
                                '</div>'+
                                '<div class="subItem">'+
                                    '<input type="checkbox" checked="checked" class="error" id="locationFormulaError" disabled="true">'+
                                    '<label for="locationFormulaError" style="color: #666">错误</label>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="listItem">'+
                            '<input type="radio" name="locationType" id="locationNull">'+
                            '<label for="locationNull">空值</label>'+
                        '</div>'+
                        '<div class="listItem">'+
                            '<input type="radio" name="locationType" id="locationCF">'+
                            '<label for="locationCF">条件格式</label>'+
                        '</div>'+
                        '<div class="listItem">'+
                            '<input type="radio" name="locationType" id="locationStepRow">'+
                            '<label for="locationStepRow">间隔行</label>'+
                        '</div>'+
                        '<div class="listItem">'+
                            '<input type="radio" name="locationType" id="locationStepColumn">'+
                            '<label for="locationStepColumn">间隔列</label>'+
                        '</div>'+
                      '</div>';

        $("body").append(replaceHtml(modelHTML, { 
            "id": "luckysheet-locationCell-dialog", 
            "addclass": "luckysheet-locationCell-dialog", 
            "title": "定位条件", 
            "content": content, 
            "botton": '<button id="luckysheet-locationCell-dialog-confirm" class="btn btn-primary">确定</button><button class="btn btn-default luckysheet-model-close-btn">取消</button>', 
            "style": "z-index:100003" 
        }));
        let $t = $("#luckysheet-locationCell-dialog").find(".luckysheet-modal-dialog-content").css("min-width", 400).end(), 
            myh = $t.outerHeight(), 
            myw = $t.outerWidth();
        let winw = $(window).width(), winh = $(window).height();
        let scrollLeft = $(document).scrollLeft(), scrollTop = $(document).scrollTop();
        $("#luckysheet-locationCell-dialog").css({ "left": (winw + scrollLeft - myw) / 2, "top": (winh + scrollTop - myh) / 3 }).show();
    },
    init: function(){
        let _this = this;

        $(document).on("click", "#luckysheet-locationCell-dialog .listItem input:radio", function(e){
            $("#luckysheet-locationCell-dialog .listItem input:checkbox").prop("disabled", true);
            $("#luckysheet-locationCell-dialog .listItem .subbox label").css("color", "#666");

            $(this).siblings(".subbox").find("input:checkbox").removeAttr("disabled");
            $(this).siblings(".subbox").find("label").css("color", "#000");
        });

        $(document).off("click.locationCellConfirm").on("click.locationCellConfirm", "#luckysheet-locationCell-dialog #luckysheet-locationCell-dialog-confirm", function(){
            $("#luckysheet-modal-dialog-mask").hide();
            $("#luckysheet-locationCell-dialog").hide();

            let $radio = $("#luckysheet-locationCell-dialog .listItem input:radio:checked");
            let id = $radio.attr("id");

            if(id == "locationConstant" || id == "locationFormula"){
                let $checkbox = $radio.siblings(".subbox").find("input:checkbox:checked");

                let value;
                if($checkbox.length == 0){
                    return;
                }
                else if($checkbox.length == 5){
                    value = "all";
                }
                else{
                    let arr = [];
                    
                    for(let i = 0; i < $checkbox.length; i++){
                        if($($checkbox[i]).hasClass("date")){
                            arr.push("d");
                        }
                        else if($($checkbox[i]).hasClass("number")){
                            arr.push("n");
                        }
                        else if($($checkbox[i]).hasClass("string")){
                            arr.push("s,g");
                        }
                        else if($($checkbox[i]).hasClass("boolean")){
                            arr.push("b");
                        }
                        else if($($checkbox[i]).hasClass("error")){
                            arr.push("e");
                        }
                    }

                    value = arr.join(",");
                }

                let range;
                if(Store.luckysheet_select_save.length == 0 || (Store.luckysheet_select_save.length == 1 && Store.luckysheet_select_save[0].row[0] == Store.luckysheet_select_save[0].row[1] && Store.luckysheet_select_save[0].column[0] == Store.luckysheet_select_save[0].column[1])){
                    //单个单元格
                    range = [{"row": [0, Store.flowdata.length - 1], "column": [0, Store.flowdata[0].length - 1]}];
                }
                else{
                    range = $.extend(true, [], Store.luckysheet_select_save);
                }

                _this.apply(range, id, value);
            }
            else if(id == "locationStepRow"){
                if(Store.luckysheet_select_save.length == 0 || (Store.luckysheet_select_save.length == 1 && Store.luckysheet_select_save[0].row[0] == Store.luckysheet_select_save[0].row[1])){
                    if(isEditMode()){
                        alert("请选择最少两行");
                    }
                    else{
                        tooltip.info("提示", "请选择最少两行"); 
                    }
                    return;                            
                }

                let range = $.extend(true, [], Store.luckysheet_select_save);

                _this.apply(range, "locationStepRow");
            }
            else if(id == "locationStepColumn"){
                if(Store.luckysheet_select_save.length == 0 || (Store.luckysheet_select_save.length == 1 && Store.luckysheet_select_save[0].column[0] == Store.luckysheet_select_save[0].column[1])){
                    if(isEditMode()){
                        alert("请选择最少两列");
                    }
                    else{
                        tooltip.info("提示", "请选择最少两列");    
                    }
                    return;                            
                }

                let range = $.extend(true, [], Store.luckysheet_select_save);

                _this.apply(range, "locationStepColumn");
            }
            else{
                let range;
                if(Store.luckysheet_select_save.length == 0 || (Store.luckysheet_select_save.length == 1 && Store.luckysheet_select_save[0].row[0] == Store.luckysheet_select_save[0].row[1] && Store.luckysheet_select_save[0].column[0] == Store.luckysheet_select_save[0].column[1])){
                    //单个单元格
                    range = [{"row": [0, Store.flowdata.length - 1], "column": [0, Store.flowdata[0].length - 1]}];
                }
                else{
                    range = $.extend(true, [], Store.luckysheet_select_save);
                }

                _this.apply(range, id);
            }
        });
    },
    apply: function(range, type, value){
        let rangeArr = [];

        if(type == "locationFormula" || type == "locationConstant" || type == "locationNull" || type == "locationCF"){
            let str, computeMap = {};

            if(type == "locationFormula"){ //公式
                if(value == "all"){
                    str = "Store.flowdata[r] != null && Store.flowdata[r][c] != null && Store.flowdata[r][c].v != null && Store.flowdata[r][c].f != null";
                }
                else{
                    str = "Store.flowdata[r] != null && Store.flowdata[r][c] != null && Store.flowdata[r][c].v != null && Store.flowdata[r][c].f != null && Store.flowdata[r][c].ct != null && value.indexOf(Store.flowdata[r][c].ct.t) != -1";
                }
            }
            else if(type == "locationConstant"){ //常量
                if(value == "all"){
                    str = "Store.flowdata[r] != null && Store.flowdata[r][c] != null && Store.flowdata[r][c].v != null && Store.flowdata[r][c].f == null && Store.flowdata[r][c].ct != null";
                }
                else{
                    str = "Store.flowdata[r] != null && Store.flowdata[r][c] != null && Store.flowdata[r][c].v != null && Store.flowdata[r][c].f == null && Store.flowdata[r][c].ct != null && value.indexOf(Store.flowdata[r][c].ct.t) != -1";
                }
            }
            else if(type == "locationNull"){ //空值
                str = "Store.flowdata[r] != null && (Store.flowdata[r][c] == null || Store.flowdata[r][c].v == null || Store.flowdata[r][c].v == '') ";
            }
            else if(type == "locationCF"){ //条件格式
                let index = getSheetIndex(Store.currentSheetIndex);
                let ruleArr = Store.luckysheetfile[index]["luckysheet_conditionformat_save"];
                let data = Store.luckysheetfile[index]["data"];

                computeMap = conditionformat.compute(ruleArr, data);

                if(JSON.stringify(computeMap) == "{}"){
                    if(isEditMode()){
                        alert("未找到单元格");
                    }
                    else{
                        tooltip.info("提示", "未找到单元格");
                    }

                    return;
                }

                str = "(r + '_' + c) in computeMap";
            }

            for(let s = 0; s < range.length; s++){
                let st_r = range[s].row[0], ed_r = range[s].row[1];
                let st_c = range[s].column[0], ed_c = range[s].column[1];
                
                if(st_r == ed_r){
                    let stack_stc = null, stack_edc = null;

                    var r = st_r;  //r, c var定义，否则eval报错
                    for(var c = st_c; c <= ed_c; c++){
                        if(c == st_c){
                            if(eval(str)){
                                stack_stc = c;
                            }
                            else{
                                stack_stc = null;
                            }
                        }
                        else if(c == ed_c){
                            if(eval(str)){
                                if(stack_stc == null){
                                    rangeArr.push({"row": [st_r, ed_r], "column": [ed_c, ed_c]});
                                }
                                else{
                                    rangeArr.push({"row": [st_r, ed_r], "column": [stack_stc, ed_c]});
                                }
                            }
                            else{
                                if(stack_edc == null && stack_stc != null){
                                    rangeArr.push({"row": [st_r, ed_r], "column": [stack_stc, stack_stc]});
                                }
                                else if(stack_edc != null){
                                    rangeArr.push({"row": [st_r, ed_r], "column": [stack_stc, stack_edc]});
                                }
                            }
                        }
                        else{
                            if(eval(str)){
                                if(stack_stc == null){
                                    stack_stc = c;
                                }
                                else{
                                    stack_edc = c;
                                }
                            }
                            else{
                                if(stack_edc == null && stack_stc != null){
                                    rangeArr.push({"row": [st_r, ed_r], "column": [stack_stc, stack_stc]});
                                    stack_stc = null;
                                }
                                else if(stack_edc != null){
                                    rangeArr.push({"row": [st_r, ed_r], "column": [stack_stc, stack_edc]});
                                    stack_stc = null;
                                    stack_edc = null;
                                }
                            }
                        }
                    }
                }
                else{
                    let stack = {}; 

                    for(var r = st_r; r <= ed_r; r++){
                        stack[r] = [];
                        let stack_stc = null, stack_edc = null;

                        for(var c = st_c; c <= ed_c; c++){
                            if(c == ed_c){
                                if(eval(str)){
                                    if(stack_stc == null){
                                        stack[r].push({"status": false, "range": [ed_c, ed_c]});
                                    }
                                    else{
                                        stack[r].push({"status": false, "range": [stack_stc, ed_c]});   
                                    }
                                }
                                else{
                                    if(stack_edc == null && stack_stc != null){
                                        stack[r].push({"status": false, "range": [stack_stc, stack_stc]});
                                    }
                                    else if(stack_edc != null){
                                        stack[r].push({"status": false, "range": [stack_stc, stack_edc]});
                                    }
                                }
                            }
                            else if(c == st_c){
                                if(eval(str)){
                                    stack_stc = c;
                                }
                                else{
                                    stack_stc = null;
                                }
                            }
                            else{
                                if(eval(str)){
                                    if(stack_stc == null){
                                        stack_stc = c;
                                    }
                                    else{
                                        stack_edc = c;
                                    }
                                }
                                else{
                                    if(stack_edc == null && stack_stc != null){
                                        stack[r].push({"status": false, "range": [stack_stc, stack_stc]});
                                        stack_stc = null;
                                    }
                                    else if(stack_edc != null){
                                        stack[r].push({"status": false, "range": [stack_stc, stack_edc]});
                                        stack_stc = null;
                                        stack_edc = null;
                                    }
                                }
                            }
                        }
                    }

                    for(let i = st_r; i <= ed_r; i++){
                        if(i == ed_r){
                            if(stack[i].length > 0){
                                for(let j = 0; j < stack[i].length; j++){
                                    if(!stack[i][j].status){
                                        rangeArr.push({"row": [ed_r, ed_r], "column": stack[i][j].range});
                                    }
                                }
                            }
                        }
                        else{
                            if(stack[i].length > 0){
                                for(let j = 0; j < stack[i].length; j++){
                                    if(!stack[i][j].status){
                                        let b = 0;
                                        
                                        for(let a = 1; a < (ed_r - i); a++){
                                            if(stack[i + a][j] != null && stack[i + a][j].range[0] == stack[i][j].range[0] && stack[i + a][j].range[1] == stack[i][j].range[1]){
                                                b = a;
                                                stack[i + a][j].status = true;
                                            }
                                            else{
                                                break;
                                            }     
                                        }

                                        rangeArr.push({"row": [i, i + b], "column": stack[i][j].range});
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if(type == "locationStepRow"){ //间隔行
            for(let s = 0; s < range.length; s++){
                if(range[s].row[0] == range[s].row[1]){
                    continue;
                }

                let st_r = range[s].row[0], ed_r = range[s].row[1];
                let st_c = range[s].column[0], ed_c = range[s].column[1];

                for(let r = st_r; r <= ed_r; r++){
                    if((r - st_r) % 2 == 0){
                        rangeArr.push({"row": [r, r], "column": [st_c, ed_c]});
                    }
                }
            }
        }
        else if(type == "locationStepColumn"){ //间隔列
            for(let s = 0; s < range.length; s++){
                if(range[s].column[0] == range[s].column[1]){
                    continue;
                }

                let st_r = range[s].row[0], ed_r = range[s].row[1];
                let st_c = range[s].column[0], ed_c = range[s].column[1];

                for(let c = st_c; c <= ed_c; c++){
                    if((c - st_c) % 2 == 0){
                        rangeArr.push({"row": [st_r, ed_r], "column": [c, c]});
                    }
                }
            }
        }

        if(rangeArr.length == 0){
            if(isEditMode()){
                alert("未找到单元格");
            }
            else{
                tooltip.info("提示", "未找到单元格");  
            }
        }
        else{
            Store.luckysheet_select_save = rangeArr;
            selectHightlightShow(); 

            let scrollLeft = $("#luckysheet-cell-main").scrollLeft(), 
                scrollTop = $("#luckysheet-cell-main").scrollTop();
            let winH = $("#luckysheet-cell-main").height(), 
                winW = $("#luckysheet-cell-main").width();

            let r1 = Store.luckysheet_select_save[0]["row"][0],
                r2 = Store.luckysheet_select_save[0]["row"][1],
                c1 = Store.luckysheet_select_save[0]["column"][0],
                c2 = Store.luckysheet_select_save[0]["column"][1];

            let row = Store.visibledatarow[r2], 
                row_pre = r1 - 1 == -1 ? 0 : Store.visibledatarow[r1 - 1];
            let col = Store.visibledatacolumn[c2], 
                col_pre = c1 - 1 == -1 ? 0 : Store.visibledatacolumn[c1 - 1];

            if (col - scrollLeft - winW + 20 > 0) {
                $("#luckysheet-scrollbar-x").scrollLeft(col - winW + 20);
            }
            else if (col_pre - scrollLeft - 20 < 0) {
                $("#luckysheet-scrollbar-x").scrollLeft(col_pre - 20);
            }

            if (row - scrollTop - winH + 20 > 0) {
                $("#luckysheet-scrollbar-y").scrollTop(row - winH + 20);
            }
            else if (row_pre - scrollTop - 20 < 0) {
                $("#luckysheet-scrollbar-y").scrollTop(row_pre - 20);
            }
        }
    }
}

export default luckysheetLocationCell;