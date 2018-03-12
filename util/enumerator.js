function selectTypeName(typeId){
    switch(typeId){
        case 0:
            return "前段";
            break;
        case 1:
            return "后台";
            break;
        case 2:
            return "Andriod";
            break;
        case 3:
            return "iOS";
            break;
        case 4:
            return "设计";
            break;
        case 5:
            return "其他";
            break;
        default:
            return "其他";
    }
}

module.exports = selectTypeName;