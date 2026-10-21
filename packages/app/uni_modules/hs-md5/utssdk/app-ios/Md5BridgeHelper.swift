//
//  Md5BridgeHelper.swift
//  hs-md5 UTS 插件 - iOS Swift 混编（CommonCrypto MD5）
//  说明：iOS 原生混编仅支持 Swift 源码，OC 源码不参与编译
//

import Foundation
import CommonCrypto

public class Md5BridgeHelper {
    /**
     * 计算字符串的 MD5 摘要（内部按 UTF-8 编码），返回 32 位小写十六进制字符串
     */
    public static func md5HexOfString(_ text: String) -> String {
        guard let data = text.data(using: .utf8) else {
            return ""
        }
        var digest = [UInt8](repeating: 0, count: Int(CC_MD5_DIGEST_LENGTH))
        data.withUnsafeBytes { (buffer: UnsafeRawBufferPointer) in
            if let baseAddress = buffer.baseAddress {
                _ = CC_MD5(baseAddress, CC_LONG(data.count), &digest)
            }
        }
        return digest.map { String(format: "%02x", Int($0)) }.joined()
    }
}
