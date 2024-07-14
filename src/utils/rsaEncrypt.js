import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 可以在这个网站生成私钥和公钥
// 密钥对生成 http://web.chacuo.net/netrsakeypair

// 这个网站生成的公钥，项目暂时使用这个公钥
const publicKey = ''

// smpe框架中私钥也放在了前端，但是一般私钥不会放在前端
// const privateKey = ''

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  console.log(txt)
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密 -- 使用私钥解密，登录用不到
// export function decrypt(txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPrivateKey(privateKey)
//   return encryptor.decrypt(txt)
// }
