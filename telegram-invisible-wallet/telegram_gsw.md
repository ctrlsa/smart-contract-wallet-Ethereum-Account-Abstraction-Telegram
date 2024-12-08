# Attempt to Use the GSW Homomorphic Commitment Scheme to Solve Telegram Authentication

As mentioned in the [invisible wallet solution](invisible_wallet.md), the key challenge for Telegram is how to "embed" the bot token
hash inside a Zero-Knowledge (ZK) circuit. This would allow computations to be performed on the bot token without revealing its
plaintext value.

The proposed solution attempts to achieve this by using a **Homomorphic Commitment Scheme**, which enables secure computations and
validation without exposing the underlying data.

For a deeper understanding, you can read more about the GSW Homomorphic Commitment Scheme [here](terms/gsw_fhe_scheme.md).

## The Solution

### Setup Phase (Performed by a Trusted Party)

#### 1. Prepare the GSW Commitment Scheme:

- Generate a random matrix $A$ that will be used in both the commitment and verification steps.

#### 2. Generate Commitments for the `bot_token`:

- First, compute the SHA-256 hash of the `bot_token`:

$$
b = \text{SHA256}(\text{bot\\_token}) \in \\{0, 1\\}^{256}
$$

where $b$ is the binary representation of the `bot_token` hash.

- Then, commit to each bit of $b$:

$$
\\{cb_i, rb_i\\} = \text{Commit}(A, b_i), \quad \forall i \in \\{1, 2, \ldots, 256\\}
$$

where $cb_i = A \times rb_i + b_i \times G$, with $G$ being the gadget matrix.

- Additionally, create commitments for bit `0` and bit `1`:

$$
\\{c0, r0\\} = \text{Commit}(A, 0)
$$

$$
\\{c1, r1\\} = \text{Commit}(A, 1)
$$

- Finally, publish $c0, r0, c1, r1, A$, and $\\{cb_i, rb_i\\} \forall i \in \\{1, 2, \ldots, 256\\}$.

### Proving Phase

#### 1. User Authentication and Information Commitment:

- After the user successfully authenticates, Telegram provides user details like _id_, _first_name_, _last_name_, _username_,
  _photo_url_, and _auth_date_:

$$
\text{info} = \\{0,1\\}^n
$$

where $n$ is the bit-length of the information. The HMAC is then generated as:

$$
\text{sig} = \text{HMAC}(\text{bot\\_token}, \text{info}) \in \\{0, 1\\}^{256}
$$

- The prover commits to the user’s info by matching each bit of `info` with the corresponding commitment:

$$
\\{cu_i, ru_i\\} =
\begin{cases}
\\{c0, r0\\} & \text{if } \text{info}_i = 0 \\
\\{c1, r1\\} & \text{if } \text{info}_i = 1
\end{cases}; \forall i \in \\{1, 2, \ldots, n\\}
$$

#### 2. Opening Computation:

- Assume there exists an $\text{Open}()$ function that can compute the opening values $r_i$ without revealing the `bot_token`. The
  prover calculates:

$$
r = \\{r_i; \forall i \in \\{1, 2, \ldots, 256\\}\\} = \text{Open}(ru, rb, \text{info})
$$

- The prover sends $cu$, $r$, `info`, and `sig` to the verifier.

### Verification Phase

#### 1. HMAC Commitment Computation:

- The verifier computes the HMAC commitment $c$ using the "Input-Independent Evaluation" technique:

$$
c = \\{c_i; \forall i \in \\{1, 2, \ldots, 256\\}\\} = \text{HMAC}_e(cu, cb)
$$

where $\text{HMAC}_e$ is a function that computes HMAC on committed values.

#### 2. Commitment Check:

- The verifier checks whether:

$$
c_i \stackrel{?}{=} A \times r_i + \text{sig}_i \times G \quad \forall i \in \\{1, 2, \ldots, 256\\}
$$

- Additionally, the verifier checks that the commitments for the user info match:

$$
cu_i \stackrel{?}{=}
\begin{cases}
c0 & \text{if } \text{info}_i = 0 \\
c1 & \text{if } \text{info}_i = 1
\end{cases}; \forall i \in \\{1, 2, \ldots, n\\}
$$

### End Result

If all checks pass, the verifier can confirm the validity of the user without knowing the plaintext `bot_token`. After the setup phase,
only Telegram and the bot owner know the `bot_token`, ensuring that no one else can produce fake proofs.

### Problems with the Solution

The main challenge is designing an $\text{Open}$ function that can handle both addition and multiplication without revealing the
underlying message. Currently, we can only perform secure addition, making the solution impractical for now.

A proof of concept code is available [here](code/hmac256_fhe).

### Conclusion

This approach is not feasible at present due to the inability to handle the required operations securely in an encrypted environment.