
// truncates string $str with $dots if its length is greater than $n
function trunc (str, n, dots = '...') {
  return str.length > n ? str.substr(0, n - dots.length) + dots : str
}
