include "Merkle.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template Withdraw(n){
    signal input nullifier;
    signal input secret; 
    signal input path_elements[n];
    signal input path_index[n]; 
    signal input root; 
    signal input nullifierHash;

    component hasher=commitmentHasher();
    hasher.secret<==secret;
    hasher.nullifier<==nullifier;

    component tree=MerkleTreeInclusionProof(n);//3 for testing purposes
    tree.leaf<==hasher.commitment;

    for(var i=0;i<n;i++){
        tree.path_elements[i]<== path_elements[i];
        tree.path_index[i]<== path_index[i];
    }
    tree.root===root;
    hasher.nullifierHash === nullifierHash;

}


component main{public [root,nullifierHash]} = Withdraw(3);