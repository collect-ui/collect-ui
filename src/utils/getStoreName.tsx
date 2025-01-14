export default function(storeName,namespace){
    if(namespace){
        return `${namespace}#${storeName}`
    }
    return storeName
}