import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { updateBadge } from '../common/badge'
import { trySendMessageToActiveTab } from '../browser/tabs'
import { UserSyncStorageKeys } from '../../lib/consts'
import { LogoLoader } from '../common/LogoLoader'
import { JobBoard } from '../../lib/jobBoard'
import { LogoBar } from './LogoBar'
import {
    isScrapeActive,
    isScrapeFinished,
    ScraperStatus,
    ScrapeStage,
} from '../common/scraperStatus'
import { StatusHeader } from './StatusHeader'
import { MainDisplay } from './MainDisplay'
import { AdvancedOptions } from './AdvancedOptions'
import { getBrowserInfo } from '../browser/runtime'
import { setSyncStorageByKey } from '../browser/storage'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { getCompanyCount, getJobCount } from '../common/dataCounts'
import {
    computeCompleteAppStatus,
    getLastSuccessfulScrapeAt,
} from '../common/completeAppStatus'
import {
    getJobBoardSetting,
    getTargetSearchActionSetting,
} from '../common/userPrefs'
import { TargetSearchAction } from '../common/targetSearchAction'

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#ffffff', // Set the background color to white
        },
    },
})

const MainContainer = () => {
    const [loading, setLoading] = useState(true)

    const [isFirefox, setIsFirefox] = useState(false)

    const [lastSuccessfulScrapeAt, setLastSuccessfulScrapeAt] = useState<
        string | null
    >(null)
    const [scraperStatus, setScraperStatus] = useState<ScraperStatus>(null)
    const [jobCount, setJobCount] = useState(0)
    const [companyCount, setCompanyCount] = useState(0)

    const [initiatedScrape, setInitiatedScrape] = useState(false)

    const completeAppStatus = useMemo(
        () =>
            computeCompleteAppStatus(
                lastSuccessfulScrapeAt,
                jobCount,
                scraperStatus,
                initiatedScrape,
            ),
        [lastSuccessfulScrapeAt, jobCount, scraperStatus, initiatedScrape],
    )

    const [jobBoard, setJobBoard] = useState(JobBoard.coop)
    const [targetSearchAction, setTargetSearchAction] = useState(
        TargetSearchAction.FOR_MY_PROGRAM,
    )

    const pollScrapeInterval = useRef(undefined)

    const beginPollingScrapeStatus = () => {
        if (pollScrapeInterval.current) {
            return
        }
        // @ts-expect-error - setInterval returns a number
        pollScrapeInterval.current = setInterval(async () => {
            await updateScraperStatus()
        }, 3000)
    }

    const onScrapeButtonClicked = async () => {
        const isOnWaterlooWorks = scraperStatus !== null
        if (isOnWaterlooWorks) {
            setInitiatedScrape(true)
            if (scraperStatus) {
                setScraperStatus({
                    stage: ScrapeStage.standby,
                    stageProgress: 0,
                    stageTarget: 1,
                })
            }
            await trySendMessageToActiveTab('scrape')
            beginPollingScrapeStatus()
        } else {
            window.open(
                'https://waterlooworks.uwaterloo.ca/waterloo.htm?action=login',
                '_blank',
            )
        }
    }

    const updateUserPreferences = async () => {
        setTargetSearchAction(await getTargetSearchActionSetting())
        setJobBoard(await getJobBoardSetting())
    }

    const refreshData = async () => {
        setJobCount(await getJobCount())
        setCompanyCount(await getCompanyCount())
        setLastSuccessfulScrapeAt(await getLastSuccessfulScrapeAt())
    }

    const updateScraperStatus = async () => {
        // Send 'status' to get scraper status
        setScraperStatus(await trySendMessageToActiveTab('status'))
    }

    useEffect(() => {
        const runAsync = async () => {
            setLoading(true)

            try {
                const browserInfo = await getBrowserInfo()
                setIsFirefox(browserInfo.name === 'Firefox')
            } catch (e) {
                setIsFirefox(false)
            }

            await updateUserPreferences()
            await refreshData()
            await updateScraperStatus()

            setLoading(false)
        }
        runAsync().then()
    }, [])

    useEffect(() => {
        if (isScrapeActive(scraperStatus)) {
            beginPollingScrapeStatus()
        } else if (isScrapeFinished(scraperStatus)) {
            clearInterval(pollScrapeInterval.current)
        }
    }, [scraperStatus])

    useEffect(() => {
        console.log(scraperStatus)
    }, [scraperStatus])

    return (
        <ThemeProvider theme={lightTheme}>
            <div
                className="d-flex-center"
                style={{
                    color: lightTheme.palette.text.primary,
                    backgroundColor: lightTheme.palette.background.default,
                    flexDirection: 'column',
                }}
            >
                <>
                    <LogoBar />
                    <StatusHeader completeAppStatus={completeAppStatus} />
                    <MainDisplay
                        scrapeButtonText={'Scrape Jobs'}
                        onScrapeButtonClicked={onScrapeButtonClicked}
                        jobCount={jobCount}
                        companyCount={companyCount}
                        jobBoard={jobBoard}
                    />
                    <AdvancedOptions
                        isFirefox={isFirefox}
                        onDataChanged={async () => {
                            await refreshData()
                            await trySendMessageToActiveTab('dataUpdated')
                        }}
                        targetSearchAction={targetSearchAction}
                        onTargetSearchActionSelect={async newValue => {
                            setTargetSearchAction(newValue)
                            await setSyncStorageByKey(
                                UserSyncStorageKeys.SETTING_TARGET_SEARCH_ACTION,
                                newValue,
                            )
                        }}
                        jobBoard={jobBoard}
                        onJobBoardSelect={async newValue => {
                            setJobBoard(newValue)
                            await setSyncStorageByKey(
                                UserSyncStorageKeys.SETTING_TARGET_JOB_BOARD,
                                newValue,
                            )
                            await refreshData()
                        }}
                    />
                </>
            </div>
        </ThemeProvider>
    )
}

// update badge on open
updateBadge().then()

// Render your React component instead
const root = createRoot(
    document.getElementById('main-container') as HTMLElement,
)
root.render(<MainContainer />)
