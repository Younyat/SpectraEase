# SpectraEase Setup Guide

This project is configured for real RF capture from an **Ettus Research USRP-B200** using **UHD/GNU Radio** through a RadioConda Python environment.

There is no mock signal in the active development flow. The UI and API are expected to show live data from the connected SDR or a real SDR error if the hardware/runtime cannot be opened.

## Requirements

- Windows with PowerShell
- Node.js 18 or higher
- Python virtual environment for the FastAPI backend
- RadioConda Python with GNU Radio and UHD installed
- Ettus Research USRP-B200 connected over USB

Current RadioConda path used during development:

```text
C:\Users\Usuario\radioconda\python.exe
```

## Recommended Run Command

From the project root:

```powershell
cd C:\Users\Usuario\Desktop\NICS\Spectum_lab\spectrum-lab

$env:DEFAULT_CENTER_FREQUENCY_HZ="89400000"
$env:DEFAULT_SAMPLE_RATE_HZ="2000000"
$env:DEFAULT_GAIN_DB="20"
$env:DEFAULT_ANTENNA="RX2"
$env:UHD_DEVICE_ARGS=""

powershell -ExecutionPolicy Bypass -File .\scripts\run_dev.ps1 -UseRealSdr 1 -RadioCondaPythonPath "C:\Users\Usuario\radioconda\python.exe"
```

URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Frontend Workflow

1. Open `http://localhost:5173`.
2. Click `Connect USB`.
3. Click `Start`.
4. Tune with:
   - `Center MHz`
   - `Span MHz`
   - `Start MHz`
   - `Stop MHz`
   - `Spectrum Left`
   - `Spectrum Right`
5. Adjust analyzer parameters:
   - `RBW`
   - `VBW`
   - `Reference`
   - `Noise offset`
   - `Detector`
   - `Averaging`
   - `Gain`
6. Click the spectrum trace to add a marker.
7. Use `Peak` to place a marker at the strongest current bin.

## Backend Configuration

Startup defaults are read from environment variables:

| Variable | Example | Description |
|----------|---------|-------------|
| `DEFAULT_CENTER_FREQUENCY_HZ` | `89400000` | Initial center frequency |
| `DEFAULT_SAMPLE_RATE_HZ` | `2000000` | Initial sample rate/span |
| `DEFAULT_GAIN_DB` | `20` | Initial gain |
| `DEFAULT_ANTENNA` | `RX2` | UHD antenna |
| `UHD_DEVICE_ARGS` | empty | Optional UHD args |
| `RADIOCONDA_PYTHON` | `C:\Users\Usuario\radioconda\python.exe` | GNU Radio/UHD Python |
| `REAL_SDR_FPS` | `5` | Spectrum worker frame rate |

The frontend can change most analyzer parameters at runtime. Environment variables are only startup defaults.

## API Endpoints

### Device

- `GET /api/device/status`
- `POST /api/device/connect`
- `POST /api/device/disconnect`
- `POST /api/device/stream/start`
- `POST /api/device/stream/stop`
- `POST /api/device/frequency`
- `POST /api/device/gain`

### Spectrum

- `GET /api/spectrum/live`
- `POST /api/spectrum/center-frequency`
- `POST /api/spectrum/span`
- `POST /api/spectrum/start-stop`
- `POST /api/spectrum/rbw`
- `POST /api/spectrum/vbw`
- `POST /api/spectrum/reference-level`
- `POST /api/spectrum/noise-floor-offset`
- `POST /api/spectrum/detector-mode`
- `POST /api/spectrum/averaging`

### Markers And Captures

- `GET /api/markers/`
- `POST /api/markers/`
- `DELETE /api/markers/{id}`
- `GET /api/recordings/`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`

## Project Structure

```text
backend/
  app/
    config/
    domain/
    application/
    infrastructure/
      sdr/
      web/
      di/
      persistence/
  tools/
    capture_and_demodulate_fm.py
    spectrum_stream_worker.py
    wfm_receiver_qt.py
```

## Troubleshooting

### Device shows disconnected

- Check the USRP-B200 USB connection.
- Confirm the backend was launched with `-UseRealSdr 1`.
- Confirm `RADIOCONDA_PYTHON` points to the RadioConda Python executable.
- Confirm RadioConda can run GNU Radio/UHD scripts outside the app.

### Spectrum is empty

- Check `/api/spectrum/live`.
- `real_sdr_pending` means the backend is waiting for the first real frame.
- `real_sdr_error` means the backend could not capture from the SDR; read the `error` field.

### Windows script policy blocks startup

Use:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run_dev.ps1 -UseRealSdr 1 -RadioCondaPythonPath "C:\Users\Usuario\radioconda\python.exe"
```

### Frontend does not update after code changes

- Stop and restart the dev script.
- Hard-refresh the browser with `Ctrl+F5`.

## Notes

- Docker Compose is not the recommended path for local USB access to the USRP-B200 on Windows.
- Legacy adapter files may still exist, but the active path is `uhd_gnuradio`.
- The backend intentionally does not synthesize fake spectrum data in the active flow.
