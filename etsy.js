const delay = ms => new Promise(res => setTimeout(res, ms));

// Get CSRF Token
const csrf = document.querySelector('[name="csrf_nonce"]').getAttribute('content');
var elemDiv = document.createElement('div');
elemDiv.id = "single-page";
elemDiv.style.display = "none";
var list = document.querySelectorAll('.tab-reorder-container li');
let oneMonthAgoDate = getOneMonthAgoDate();
var data = await getReviews(list);


async function getReviews(list) {
    for (var i = 0; i < list.length; i++) {
        // for first one
        // if (i == 5) {
        //     break;
        // }

        //Get Data of product
        elemDiv.innerHTML = "";
        document.body.appendChild(elemDiv);
        var list_id = (list[i].querySelector('.v2-listing-card').getAttribute('data-listing-id'));
        var shop_id = (list[i].querySelector('.v2-listing-card').getAttribute('data-shop-id'));
        var title = (list[i].querySelector('.v2-listing-card .listing-link').getAttribute('title'));

        //Call Reviews Apis
        var reviewpage = 4;

        // for first page of review
        for (var p = 1; p <= reviewpage; p++) {
            let fetchRes = await fetch("https://www.etsy.com/api/v3/ajax/bespoke/member/neu/specs/reviews", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-GB,en;q=0.9,ar-SA;q=0.8,ar;q=0.7,en-US;q=0.6",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-csrf-token": csrf,
                    "x-detected-locale": "USD|en-GB|PK",
                    "x-page-guid": "f3a111a15a5.9307db69d6cc762fc8d8.00",
                    "x-recs-primary-location": "https://www.etsy.com/listing/694257329/handmade-wooden-hand-bag-brown-leather?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=&ref=pagination&frs=1&sts=1&plkey=821eaf5dbf0899ac743d8fa61e9fbed387c267fa%3A694257329&page=2",
                    "x-recs-primary-referrer": "https://www.etsy.com/c/bags-and-purses/handbags/clutches-and-evening-bags?ref=catnav-10855",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://www.etsy.com/listing/694257329/handmade-wooden-hand-bag-brown-leather?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=&ref=pagination&frs=1&sts=1&plkey=821eaf5dbf0899ac743d8fa61e9fbed387c267fa%3A694257329&page=2",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "log_performance_metrics=false&specs%5Breviews%5D%5B%5D=Etsy%5CModules%5CListingPage%5CReviews%5CApiSpec&specs%5Breviews%5D%5B1%5D%5Blisting_id%5D=" + list_id + "&specs%5Breviews%5D%5B1%5D%5Bshop_id%5D=" + shop_id + "&specs%5Breviews%5D%5B1%5D%5Brender_complete%5D=true&specs%5Breviews%5D%5B1%5D%5Bactive_tab%5D=same_listing_reviews&specs%5Breviews%5D%5B1%5D%5Bshould_lazy_load_images%5D=false&specs%5Breviews%5D%5B1%5D%5Bshould_use_pagination%5D=false&specs%5Breviews%5D%5B1%5D%5Bpage%5D=" + p + "&specs%5Breviews%5D%5B1%5D%5Bshould_show_variations%5D=false&specs%5Breviews%5D%5B1%5D%5Bis_reviews_untabbed_cached%5D=false&specs%5Breviews%5D%5B1%5D%5Bwas_landing_from_external_referrer%5D=false&specs%5Breviews%5D%5B1%5D%5Bfilter_has_photos%5D=false&specs%5Breviews%5D%5B1%5D%5Bfilter_rating%5D=0&specs%5Breviews%5D%5B1%5D%5Bsort_option%5D=Recency",
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            })
            if (fetchRes.ok) {
                var single_div = document.getElementById('single-page');
                html = await fetchRes.json();
                single_div.innerHTML += html.output.reviews
            } else {
                console.warn('Something went wrong.');
            }
            await delay(1000);
        }


        // Get Last month reviews
        var lastMonthReviews = [];
        var review_dates = document.querySelectorAll('#single-page .wt-grid__item-xs-12 .wt-grid .wt-display-flex-xs.wt-align-items-center.wt-pt-xs-1 .wt-text-caption');


        for (r = 0; r < review_dates.length; r++) {
            let reviewer_name = review_dates[r].querySelector('a');
            if (reviewer_name) {
                review_dates[r].querySelector('a').remove();
            }
            let review_date = review_dates[r].innerText;
            if (new Date(review_date) >= oneMonthAgoDate) {
                lastMonthReviews.push(review_date)
            }
        }

        // Append Text
        var review_text = `<span class="xjl6v9att" aria-hidden="true">Last Month Reviews ${lastMonthReviews.length} </span>`
        let productElment = list[i].querySelector('.v2-listing-card .listing-link .v2-listing-card__info');
        productElment.innerHTML += review_text;
    }

}


function getOneMonthAgoDate() {
    var d = new Date();
    return d.setMonth(d.getMonth() - 1);
}
