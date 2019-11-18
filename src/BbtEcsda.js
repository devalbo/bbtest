// this is a test example replacement for bitcoincashjs-lib/src/ecsda.js

var typeforce = require('typeforce')
var types = require('./BbtTypes')

var BigInteger = require('bigi')
var ECSignature = require('./BbtEcSignature')

var ecurve = require('ecurve')
var secp256k1 = ecurve.getCurveByName('secp256k1')

var deterministicGenerateK = require('./BbtRfc6979').deterministicGenerateK

var bbtConfig = require('./BbtConfig');

var N_OVER_TWO = secp256k1.n.shiftRight(1)

function sign (hash, d) {
  console.log("BBNV: IN ECDSA SIGN")

  if (bbtConfig.isTypeforceEnabled()) {
    typeforce(types.tuple(types.Hash256bit, types.BigInt), arguments)
  }
  console.log("BBNV: IN ECDSA SIGN - POST typeforce")

  var x = d.toBuffer(32)
  console.log("BBNV: IN ECDSA SIGN - PRE BigInteger.fromBuffer")
  var e = BigInteger.fromBuffer(hash)
  console.log("BBNV: IN ECDSA SIGN - POST BigInteger.fromBuffer")
  var n = secp256k1.n
  var G = secp256k1.G

  var r, s
  console.log("BBNV: IN ECDSA SIGN - PRE deterministicGenerateK")
  deterministicGenerateK(hash, x, function (k) {
    console.log("BBNV: IN ECDSA SIGN - PRE deterministicGenerateK/multiple")
    var Q = G.multiply(k)

    if (secp256k1.isInfinity(Q)) return false

    r = Q.affineX.mod(n)
    if (r.signum() === 0) return false

    s = k.modInverse(n).multiply(e.add(d.multiply(r))).mod(n)
    if (s.signum() === 0) return false

    return true
  })

  // enforce low S values, see bip62: 'low s values in signatures'
  if (s.compareTo(N_OVER_TWO) > 0) {
    s = n.subtract(s)
  }

  console.log("BBNV: CONSTRUCTING ECSignature")
  return new ECSignature(r, s)
}

function verify (hash, signature, Q) {
  typeforce(types.tuple(
    types.Hash256bit,
    types.ECSignature,
    types.ECPoint
  ), arguments)

  var n = secp256k1.n
  var G = secp256k1.G

  var r = signature.r
  var s = signature.s

  // 1.4.1 Enforce r and s are both integers in the interval [1, n − 1]
  if (r.signum() <= 0 || r.compareTo(n) >= 0) return false
  if (s.signum() <= 0 || s.compareTo(n) >= 0) return false

  // 1.4.2 H = Hash(M), already done by the user
  // 1.4.3 e = H
  var e = BigInteger.fromBuffer(hash)

  // Compute s^-1
  var sInv = s.modInverse(n)

  // 1.4.4 Compute u1 = es^−1 mod n
  //               u2 = rs^−1 mod n
  var u1 = e.multiply(sInv).mod(n)
  var u2 = r.multiply(sInv).mod(n)

  // 1.4.5 Compute R = (xR, yR)
  //               R = u1G + u2Q
  var R = G.multiplyTwo(u1, Q, u2)

  // 1.4.5 (cont.) Enforce R is not at infinity
  if (secp256k1.isInfinity(R)) return false

  // 1.4.6 Convert the field element R.x to an integer
  var xR = R.affineX

  // 1.4.7 Set v = xR mod n
  var v = xR.mod(n)

  // 1.4.8 If v = r, output "valid", and if v != r, output "invalid"
  return v.equals(r)
}

module.exports = {
  deterministicGenerateK: deterministicGenerateK,
  sign: sign,
  verify: verify,

  // TODO: remove
  __curve: secp256k1
}
