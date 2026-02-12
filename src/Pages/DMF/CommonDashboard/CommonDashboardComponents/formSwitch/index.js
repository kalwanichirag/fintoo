import { Switch } from "evergreen-ui"
import { useState, useEffect } from "react"

const FormSwitch = (props) => {
    const [isChecked, setIsChecked] = useState(props.switchValue ?? false);
    
    // Update internal state when prop changes
    useEffect(() => {
        setIsChecked(props.switchValue ?? false);
    }, [props.switchValue]);
    
    const handleChange = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        props.onSwitchToggle();
    };
    
    return (
        <Switch
            onChange={handleChange}
            checked={isChecked}
            className="react-switch px-2"
            height={20}
            width={40}
        />
    )
}

export default FormSwitch