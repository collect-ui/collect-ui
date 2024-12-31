export default function(props){
    let _target=props._target
    for (let key in props) {
        if (key.startsWith("_target_")) {
            if(!_target){
                _target={}
            }
            let newKey = key.replace("_target_","")
            _target[newKey]=props[key]
        }
    }
    return _target
}