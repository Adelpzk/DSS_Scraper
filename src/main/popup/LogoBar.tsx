import logo from '../../assets/icons/DSS_LONG_LOGO.png'

export const LogoBar = () => {
    return (
        <button
            onClick={() => {
                console.log('Clicked on logo bar, opening FindWorks')
                window.open('http://localhost:3000/', '_blank')
            }}
            style={{
                width: '100%',
                padding: '9px',
                cursor: 'pointer',
                background: 'none',
                color: 'inherit',
                border: 'none',
                outline: 'inherit',
            }}
        >
            <img src={logo} alt="Logo" height={50} />
        </button>
    )
}
