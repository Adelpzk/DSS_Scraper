import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { clearLocalStorage, setLocalStorage } from '../browser/storage'
import {
    clearLastScrapeStatus,
    exportJSON,
    openJsonFilePicker,
} from './dataLoader'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { JobBoard } from '../../lib/jobBoard'
import { WaveColors } from '../common/waveColors'
import { TargetSearchAction } from '../common/targetSearchAction'

interface IAdvancedOptionsProps {
    isFirefox: boolean
    onDataChanged: () => Promise<void>
    targetSearchAction: TargetSearchAction
    onTargetSearchActionSelect: (newValue: TargetSearchAction) => Promise<void>
    jobBoard: JobBoard
    onJobBoardSelect: (newValue: JobBoard) => Promise<void>
}

export const AdvancedOptions = (props: IAdvancedOptionsProps) => {
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false)

    const handleTargetSearchActionChange = (event: SelectChangeEvent) => {
        props.onTargetSearchActionSelect(event.target.value).then()
    }

    const handleJobBoardChange = (event: SelectChangeEvent) => {
        props.onJobBoardSelect(event.target.value).then()
    }

    return (
        <>
            <div
                className="d-flex-center"
                style={{
                    justifyContent: 'left',
                    padding: '10px 12px',
                    width: 'calc(100% - 24px)',
                    color: "white",
                    backgroundColor: WaveColors.DARK_BLUE,
                    cursor: 'pointer',
                }}
                onClick={() => {
                    setIsAdvancedOptionsOpen(!isAdvancedOptionsOpen)
                }}
            >
                {isAdvancedOptionsOpen ? (
                    <ExpandLessIcon />
                ) : (
                    <ExpandMoreIcon />
                )}
                <h3>Advanced Options</h3>
            </div>
            <div
                className="d-flex-center"
                style={{
                    flexDirection: 'column',
                    padding: '18px',
                    paddingTop: '8px',
                    width: 'calc(100% - 36px)',
                    backgroundColor: WaveColors.DARK_BLUE,
                    color: "white",
                    display: isAdvancedOptionsOpen ? 'flex' : 'none',
                    justifyContent: 'start',
                    minHeight: 0,
                    maxHeight: '200px',
                    overflow: 'auto',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '5px',
                        width: '100%',
                        marginBottom: '12px',
                    }}
                >

                    <div
                        className="d-flex-center"
                        style={{
                            flex: 1,
                            backgroundColor: "white",
                            borderRadius: 2,
                            height: '40px',
                            color: "black",
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={async () => {
                            await clearLocalStorage()
                            await clearLastScrapeStatus()

                            await props.onDataChanged()
                        }}
                    >
                        <h3>Clear Scraped Data</h3>
                    </div>
                </div>

                <h3 style={{ marginBottom: '12px' }}>Options</h3>
                <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                <InputLabel id="demo-select-small-label" sx={{ color: 'white' }}>
                    Target Search Action
                </InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={props.targetSearchAction}
                    label="Target Search Action"
                    onChange={handleTargetSearchActionChange}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'white',
                        },
                        color: 'white',
                    }}
                >
                    <MenuItem value={TargetSearchAction.FOR_MY_PROGRAM}>
                        For My Program
                    </MenuItem>
                    <MenuItem value={TargetSearchAction.DEFAULT_SEARCH}>
                        Default Search
                    </MenuItem>
                    <MenuItem value={TargetSearchAction.VIEWED}>
                        Viewed
                    </MenuItem>
                </Select>
                <FormHelperText sx={{ color: 'white' }}>
                    The list of jobs from this search will be scraped.
                </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="demo-select-small-label" sx={{ color: 'white' }}>
                    Job Board
                </InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={props.jobBoard}
                    label="Job Board"
                    onChange={handleJobBoardChange}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'white',
                        },
                        color: 'white',
                    }}
                >
                    <MenuItem value={JobBoard.coop}>Co-op</MenuItem>
                    <MenuItem value={JobBoard.fulltime}>Full-time</MenuItem>
                    <MenuItem value={JobBoard.other}>Other</MenuItem>
                </Select>
                <FormHelperText sx={{ color: 'white' }}>
                    The job board that will be scraped.
                </FormHelperText>
            </FormControl>
            </div>
        </>
    )
}
