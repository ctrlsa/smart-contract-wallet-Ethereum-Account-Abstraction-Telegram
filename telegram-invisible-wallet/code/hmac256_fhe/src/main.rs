mod padding;
mod boolean_ops;
mod sha256;

use std::io;
use tfhe::boolean::prelude::*;
use padding::pad_sha256_input;
use sha256::{sha256_fhe, bools_to_hex};
use crate::padding::{compute_padding, string_as_bool_vec};

fn main() {
    // INTRODUCE INPUT FROM STDIN

    let i = "12";
    let i2 = "34";
    let length_i2 = 16;
    // CLIENT PADS DATA AND ENCRYPTS IT

    let (ck, sk) = gen_keys();


    let i_bool = string_as_bool_vec(i);
    let i2_bool = string_as_bool_vec(i2);

    let mut encrypted_i1 = encrypt_bools(&i_bool, &ck);
    let encrypted_i2 = encrypt_bools(&i2_bool, &ck);

    let padded_path = compute_padding(i_bool.len(), length_i2);
    eprintln!("padded_path.len() = {:#?}", padded_path.len());
    eprintln!("padded_path = {:?}", padded_path);
    let encrypted_padded_path = encrypt_bools(&padded_path, &ck);
    // SERVER COMPUTES OVER THE ENCRYPTED PADDED DATA

    encrypted_i1.extend(encrypted_i2.iter().cloned());
    encrypted_i1.extend(encrypted_padded_path.iter().cloned());
    eprintln!("encrypted_i1.len() = {:#?}", encrypted_i1.len());
    println!("Computing the hash");
    let encrypted_output = sha256_fhe(encrypted_i1, &sk);

    // CLIENT DECRYPTS THE OUTPUT

    let output = decrypt_bools(&encrypted_output, &ck);
    let outhex = bools_to_hex(output);

    println!("{}", outhex);
}

fn encrypt_bools(bools: &Vec<bool>, ck: &ClientKey) -> Vec<Ciphertext> {
    let mut ciphertext = vec![];

    for bool in bools {
        ciphertext.push(ck.encrypt(*bool));
    }
    ciphertext
}

fn decrypt_bools(ciphertext: &Vec<Ciphertext>, ck: &ClientKey) -> Vec<bool> {
    let mut bools = vec![];

    for cipher in ciphertext {
        bools.push(ck.decrypt(&cipher));
    }
    bools
}
