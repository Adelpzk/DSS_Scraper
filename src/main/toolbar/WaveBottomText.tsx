import logo from '../../assets/icons/DSS.png'

export const WaveBottomText = () => {
    return (
        <div className={'bottom-text-box'}>
            <div className={'text-with-logo'}>
                <h2>
                    For advanced usage and options, open the extension popup in
                    the top right corner of your browser.
                </h2>
                <img
                    style={{
                        height:'20px',
                        width:'20px'
                    }}
                    src={logo}
                    alt="Logo"
                />
            </div>
        </div>
    )
}
