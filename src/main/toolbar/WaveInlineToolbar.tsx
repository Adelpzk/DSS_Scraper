import React from 'react'
import {
    CompleteAppState,
    CompleteAppStatus,
} from '../common/completeAppStatus'
import logo from '../../assets/icons/DSS_LONG_LOGO.png'

interface IWaveInlineToolbarProps {
    loading: boolean
    completeAppStatus: CompleteAppStatus
    onPrimaryButtonClicked: () => void
}

export const WaveInlineToolbar = (props: IWaveInlineToolbarProps) => {
    const { loading, completeAppStatus, onPrimaryButtonClicked } = props

    let buttonText: string
    switch (completeAppStatus.appState) {
        case CompleteAppState.SETUP:
            buttonText = 'Scrape Jobs'
            break
        case CompleteAppState.SCRAPE_ERROR:
            buttonText = 'Retry'
            break
        case CompleteAppState.DATA_READY_WARNING:
            buttonText = 'Re-scrape Jobs'
            break
        case CompleteAppState.SCRAPE_COMPLETE:
        case CompleteAppState.DATA_READY_OK:
            buttonText = 'Browse Jobs'
            break
        default:
            buttonText = ''
            break
    }
    if (loading) {
        buttonText = ''
    }

    return (
        <div
            className="container-box"
            style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '8px',
            }}
        >
            <img
                className="logo"
                src={logo}
                alt="Logo"
                style={{ height: '60px', width: 'auto' }}
            />
            <button
                onClick={onPrimaryButtonClicked}
                className={'main-button'}
                style={{
                    background: completeAppStatus.bgColor,
                    cursor: buttonText ? 'pointer' : 'default',
                    marginLeft: '15px'
                }}
                disabled={!buttonText}
            >
                {buttonText || 'Scraping...'}
            </button>
            {!loading && (
                <h1
                    style={{
                        color: '#333',
                        fontSize: '16px',
                        margin: '10px 0',
                    }}
                >
                    {completeAppStatus.statusMessage}&nbsp;
                    {completeAppStatus.statusMessageLine2}
                </h1>
            )}
        </div>
    )
}
