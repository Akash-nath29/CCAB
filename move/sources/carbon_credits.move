module carbon_credits {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_framework::aptos_coin::AptosCoin;

    struct CarbonCredit has key {
        amount: u64,
        owner: address,
        price: u64,
        listed: bool,
        created_at: u64,
        token_id: vector<u8>
    }

    public entry fun mint(account: &signer, amount: u64, token_id: vector<u8>) {
        let credit = CarbonCredit {
            amount,
            owner: signer::address_of(account),
            price: 0,
            listed: false,
            created_at: timestamp::now_seconds(),
            token_id
        };
        move_to(account, credit);
    }

    public entry fun list(account: &signer, price: u64) acquires CarbonCredit {
        let owner = signer::address_of(account);
        let credit = borrow_global_mut<CarbonCredit>(owner);
        credit.price = price;
        credit.listed = true;
    }

    public entry fun buy(
        buyer: &signer,
        seller: address
    ) acquires CarbonCredit {
        let credit = borrow_global_mut<CarbonCredit>(seller);
        assert!(credit.listed == true, 0);

        let buyer_addr = signer::address_of(buyer);
        assert!(buyer_addr != seller, 1); // Cannot buy own credits

        // Transfer APT tokens from buyer to seller
        coin::transfer<AptosCoin>(buyer, seller, credit.price);

        // Update credit ownership
        credit.owner = buyer_addr;
        credit.listed = false;
    }

    public entry fun unlist(account: &signer) acquires CarbonCredit {
        let owner = signer::address_of(account);
        let credit = borrow_global_mut<CarbonCredit>(owner);
        credit.listed = false;
        credit.price = 0;
    }

    #[test_only]
    public fun setup_test(aptos_framework: &signer) {
        use std::vector;
        use aptos_framework::account;

        let seller = account::create_account_for_test(@0x1);
        let buyer = account::create_account_for_test(@0x2);

        mint(&seller, 100, vector::empty());
        list(&seller, 50);

        coin::transfer<AptosCoin>(aptos_framework, @0x2, 100);
        buy(&buyer, @0x1);
    }
}