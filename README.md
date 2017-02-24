# good-formatters

## Apache Formatter
Credit goes to [good-apache-log](https://github.com/jhs/good-apache-log) but this works with good 7.x.

Example usage
```
const goodOptions = {
    reporters: {
        fileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ 'response': '*', 'request-error': '*' }]
        }, {
            module: 'good-formatters',
            name: 'Apache',
            // pre-defined formats are 'combined', 'common', 'referrer'
            args: [{ format: 'common' }]
        }, {
            module: 'good-file',
            args: ['./apache-log.txt']
        }]
    }
}
```

### Predefined Formats
* ***combined***: `%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\"`
* ***common***: `%h %l %u %t \"%r\" %>s %b`
* ***referer***: `%{Referer}i -> %U`

[see apache log files](https://httpd.apache.org/docs/1.3/logs.html)
