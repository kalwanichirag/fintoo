
import styled from 'styled-components';

const Button = styled.button`
    text-align: center;
    background: #042b62;
    text-decoration: none;
    font-weight: 900;
    color: #fff;
    padding: 5px;
    border-radius: 20px;
    border: none;
    font-size: 1rem;
    min-width: 7rem;
    :disabled {
        background: #D3D3D3;
        cursor: not-allowed;
    }
`
const FintooButton = ({className, title, ...props}) => {
    return (
        <Button {...props} className={`btn-fintoo ${className ? className : ""}`}>{title}</Button>
    );
}

export default FintooButton;
