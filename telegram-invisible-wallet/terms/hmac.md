# HMAC

This definition is taken from [RFC 2104](https://datatracker.ietf.org/doc/html/rfc2104):

$$  
\begin{align}  
\text{HMAC}(K, m) &= \text{H}\Bigl(\bigl(K' \oplus opad\bigr) \parallel  
\text{H} \bigl(\left(K' \oplus ipad\right) \parallel m\bigr)\Bigr) \\  
K' &= \begin{cases}  
\text{H}\left(K\right) & \text{if K is larger than block size} \\  
K & \text{otherwise}  
\end{cases}  
\end{align}  
$$

where:

- `H` is a cryptographic hash function.
- `m` is the message to be authenticated.
- `K` is the secret key.
- `K'` is a block-sized key derived from the secret key, either by padding to the right with 0s up to the block size, or by hashing
  down to less than or equal to the block size first and then padding to the right with zeros.
- $\parallel$ denotes `concatenation`.
- $\oplus$ denotes bitwise `exclusive or` (XOR).
- `opad` is the block-sized outer padding, consisting of repeated bytes valued `0x5c`.
- `ipad` is the block-sized inner padding, consisting of repeated bytes valued `0x36`.

## HMAC-SHA-256

This is basically using HMAC with SHA-256 as the hash function.