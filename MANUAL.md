# iTunes Analytics API extractor

## What It Does

This component extracts data from iTunes Analytics specificaly about published app usage.

https://analytics.itunes.apple.com/#/apps

### Allowed metrics for data extraction

- installs
- sessions
- pageViews
- activeDevices
- crashes
- payingUsers
- units
- sales
- iap (in app purchases)
- impressions
- impressionsUnique"

### Output data files

#### Data

Contains downloaded data.

Columns:
- date
- metric
- value
- appId

#### Apps

Contains data about published apps and it's details.

Columns:
- name
- adamId
- isBundle
- iconUrl
- assetToken
- platforms
- isEnabled
- appOptInRate
- preOrderInfo
- providerId

## Configuration

### Parameters

<pre>
{
  "#username": <email-account>,
  "#password": <secret-password>,
  "providerId": <your-id>,
  "metrics": One or more from metric list above ["units", ...],
  "changedInLastDays": The time period for which the data will be extracted. (optional - default: 2 days)
}
</pre>


- `#username` is your account name
- `#password` is your secret account password
- `providerId` is your unique ID
- `metrics` is list of metrics you want to gather data for
- `changedInLastDays` is time range for data extract


## Contact

BizzTreat, s.r.o
Řehořova 968/42
Prague

If you have any question contact support@bizztreat.com

Cheers!