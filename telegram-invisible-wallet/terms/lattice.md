# Lattice

In cryptography, a lattice is a discrete grid-like structure in n-dimensional space that is used in various cryptographic algorithms
and protocols. Lattices are particularly significant in the field of lattice-based cryptography, which is considered to be resistant to
attacks by quantum computers, unlike many traditional cryptographic systems.

**References:**

+ [Lattice-based cryptography: The tricky math of dots (highly recommended)](https://www.youtube.com/watch?v=QDdOoYdb748)

## Definition

A lattice $\Lambda$ in $\mathbb{R}^n$ is a set of points generated by integer linear combinations of basis vectors
$\mathbf{b}_1, \mathbf{b}_2, \ldots, \mathbf{b}_n$. Formally, it can be defined as:

$$ \Lambda=\{ \sum_{i=1}^n z_i \mathbf{b}_i \mid z_i \in \mathbb{Z} \} $$

Here, $\mathbf{b}_i$ are the **basis vectors** of the lattice.

## Hard Problems on Lattices

+ **Shortest Vector Problem (SVP)**: Finding the shortest non-zero vector in the lattice.
+ **Closest Vector Problem (CVP)**: Finding the closest lattice point to a given point in $\mathbb{R}^n$.

These problems are computationally hard, which forms the basis for the security of lattice-based cryptographic schemes.

> [!NOTE]
>
> It's easier to solve these problems if using "good" bases (the vectors are close to perpendicular) than the "bad" ones (the vectors
> are much closer to parallel).

## Applications in Cryptography

+ **Public Key Crypto systems**: Lattice-based cryptographic schemes such as NTRU and Learning With Errors (LWE) provide
  alternatives to traditional RSA and ECC systems.
+ **Homomorphic Encryption**: Some lattice-based systems allow for homomorphic operations, meaning computations can be performed on
  encrypted data without decrypting it.
+ **Digital Signatures**: Lattice-based signature schemes like BLISS (Bimodal Lattice Signature Scheme) provide secure and
  efficient signature generation and verification.
+ **Post-Quantum Cryptography**: Lattice-based cryptography is a major candidate for post-quantum cryptographic standards because
  of its resistance to quantum attacks.

## Learning With Errors (LWE)

+ One of the most important problems in lattice-based cryptography, LWE involves solving systems of linear equations with some
  added noise (errors). The hardness of LWE forms the foundation for many cryptographic primitives.

See [Learning With Errors](learning_with_errors.md) for further details.

## Benefits of Lattice-based Cryptography

+ **Quantum Resistance**: Lattice-based cryptographic schemes are believed to be secure against quantum attacks.
+ **Efficiency**: Some lattice-based schemes offer efficient encryption and decryption processes.
+ **Versatility**: Lattice-based cryptography supports advanced cryptographic functionalities like homomorphic encryption,
  identity-based encryption, and attribute-based encryption.