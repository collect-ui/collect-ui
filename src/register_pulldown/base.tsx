
export type PullDownConfig = {
    api: string;
    data?: any;
    labelField?: string;
    mountGetData?: boolean;
    rowKey?: string;
    width?: number;
    props?: any;
    colDefs?: any;
    idField?:string;
    valueField?: string;
    footerText?: string;
    simpleList?: boolean;
    simpleSearch?: boolean;
    url?: string;
    split?: string;
    showType?: string;
    searchField?: string;
    searchPlaceholder?: string;
    searchFieldDefaultValue?: string;
    multiple?: boolean;
    pagination?: boolean;
    tree?: boolean;
    attrs?: any;
    none_with_new?: boolean;
    method?: string;
    resultField?: string;
    otherAttrs?: Record<string, any>;
    placeholder?: string;
    selectedShow?: string;
    afterRender?:any;
};
class Base{
    private readonly config: PullDownConfig;
    constructor(config){
        this.config = config;
    }
    getApi(){
        return "post:"+this.config.api+"?service="+this.config.data["service"];
    }
    getIdField(){
        if(this.config.idField){
            return this.config.idField;
        }else{
            return this.config.valueField
        }

    }
    getLabelField(){
        if(!this.config.labelField){
            console.error(this.config);
            console.error('labelField 未设置');
        }
        return this.config.labelField;
    }
    getMountGetData(){
        return this.config.mountGetData;
    }
    getRowKey(){
        return this.config.rowKey;
    }
    getAfterRender(){
        return this.config.afterRender;
    }
    setAfterRender(afterRender){
        this.config.afterRender = afterRender;
    }

    getWidth(){

        if( Object.keys(this.config).indexOf("width")>=0){
            return this.config.width;
        }
        return 540

    }
    getProps(){
        return this.config.props;
    }
    getColDefs(){
        return this.config.colDefs;
    }
    setColDefs(colDefs){
        this.config.colDefs=colDefs
    }
    getValueField(){
        if(!this.config.valueField){
            console.error(this.config);
            console.error('valueField 未设置');
        }
        return this.config.valueField;
    }
    getData(){
        return this.config.data;
    }
    getFooterText(){
        return this.config.footerText;
    }
    getSimpleList(){
        return this.config.simpleList;
    }
    getSimpleSearch(){
        // 默认简单搜索
        if (Object.keys(this.config).indexOf("simpleSearch")<0){
            return true
        }
        let simpleSearch = this.config.simpleSearch

        if(simpleSearch){
            return true
        }
        return false
    }
    getUrl(){
        // if(!this.config.url){
        //     console.error(this.config);
        //     console.error('url 未设置');
        // }
        // return this.config.url;
    }

    getSplit() {
        return this.config.split;
    }
    getShowType(){
        if(this.config.showType){
            return this.config.showType;
        }
        // 默认表格
        return "table"
    }
    getSearchField(){
        return this.config.searchField;
    }
    getSearchPlaceholder(){
        return this.config.searchPlaceholder;
    }
    getSearchFieldDefaultValue(){
        return this.config.searchFieldDefaultValue;
    }
    isMultiple(){

        return this.config.multiple;
    }
    isPagination(){
        return this.config.pagination;
    }
    isTree(){
        return this.config.tree;
    }
    getAttrs() {
        return this.config.attrs;
    }
    isNoneWithNew(){
        return this.config.none_with_new;
    }
    getMethod(){
        if(!this.config.method){
            return "get"
        }
        return this.config.method;
    }
    getResultField(){
        return this.config.resultField;
    }
    getOtherAttrs(){
        if(!this.config.otherAttrs){
            return {};
        }
        return this.config.otherAttrs;
    }
    getPlaceholder(){
        if(!this.config.placeholder) {
            return "请选择"
        }
        return this.config.placeholder;
    }
    getSelectedShow(){
        if(this.config.selectedShow){
            return this.config.selectedShow;
        }
        return "tag"
    }
}

export default Base
