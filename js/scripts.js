function createCard(user) {
    var divCard = $(document.createElement('div'));
    divCard.addClass('card');
    
    var divCardImage = $(document.createElement('div'));
    var img = $(document.createElement('img'));
    
    img.addClass('card-img');
    img.attr('src', user.picture.medium);
    img.attr('alt', 'profile picture');
    
    divCardImage.addClass('card-img-container');
    divCardImage.append(img);
    
    var divInfo = $(document.createElement('div'));
    divInfo.addClass('card-info-container');
    
    var h3Name = $(document.createElement('h3'));
    var pEmail = $(document.createElement('p'));
    var pLocation = $(document.createElement('p'));
    
    h3Name.addClass('card-name cap');
    h3Name.text(user.name.first + " " + user.name.last);
    pEmail.addClass('card-text');
    pEmail.text(user.email);
    pLocation.addClass('card-text cap');
    pLocation.text(user.location.city + ", " + user.location.state);
    
    divInfo.append(h3Name);
    divInfo.append(pEmail);
    divInfo.append(pLocation);

    divCard.append(divCardImage);
    divCard.append(divInfo);

    return divCard;
}

function createModal(user) {
    var divModalContainer = $(document.createElement('div'));
    divModalContainer.addClass('modal-container');

    var divModal = $(document.createElement('div'));
    divModal.addClass('modal');
    divModalContainer.append(divModal);

    var buttonClose = $(document.createElement('button'));
    buttonClose.addClass('modal-close-btn');
    buttonClose.attr('type', 'button');
    buttonClose.attr('id', 'modal-close-btn');
    buttonClose.append('<strong>X</strong>');
    buttonClose.on('click', function(){
        divModalContainer.hide();
    });

    divModal.append(buttonClose);

    var divModalInfo = $(document.createElement('div'));
    divModalInfo.addClass('modal-info-container');

    divModal.append(divModalInfo);

    var img = $(document.createElement('img'));
    
    img.addClass('modal-img');
    img.attr('src', user.picture.large);
    img.attr('alt', 'profile picture');

    divModalInfo.append(img);

    var h3Name = $(document.createElement('h3'));
    h3Name.text(user.name.first + " " + user.name.last)
    h3Name.attr('id', 'name');
    h3Name.addClass('modal-name cap');

    divModalInfo.append(h3Name);

    var pEmail = $(document.createElement('p'));
    pEmail.addClass('modal-text');
    pEmail.text(user.email);

    divModalInfo.append(pEmail);

    var pCity = $(document.createElement('p'));
    pCity.addClass('modal-text cap');
    pCity.text(user.location.city);

    divModalInfo.append(pCity);
    divModalInfo.append('<hr>');

    var pPhone = $(document.createElement('p'));
    pPhone.addClass('modal-text');
    pPhone.text(user.phone);

    divModalInfo.append(pPhone);

    var pStreet = $(document.createElement('p'));
    pStreet.addClass('modal-text');
    pStreet.text(user.location.street);

    divModalInfo.append(pStreet);

    var pBirthday = $(document.createElement('p'));
    pBirthday.addClass('modal-text');

    var dateUtc = new Date(user.registered.date);

    pBirthday.text('Birthday: ' + dateUtc.getUTCDate() + '/' + (dateUtc.getMonth() + 1) + '/' + dateUtc.getFullYear());

    divModalInfo.append(pBirthday);

    var divModalBtn = $(document.createElement('div'));
    divModalBtn.addClass('modal-btn-container');

    var btnPrev = $(document.createElement('button'));
    btnPrev.addClass('modal-prev btn');
    btnPrev.attr('type', 'button');
    btnPrev.attr('id', 'modal-prev');
    btnPrev.text('Prev');

    divModalBtn.append(btnPrev);

    var btnNext = $(document.createElement('button'));
    btnNext.addClass('modal-next btn');
    btnNext.attr('type', 'button');
    btnNext.attr('id', 'modal-next');
    btnNext.text('Next');
    
    divModalBtn.append(btnNext);

    divModalContainer.append(divModalBtn);

    return divModalContainer;
}

function addPrevEvent(users, index) {
    if(index > 0) {
        $('#modal-prev').on('click', {user: users[index - 1]}, function(event) {
            var modal = createModal(event.data.user);
            $('.modal-container').remove();
            $('body').append(modal);
            addPrevEvent(users, index-1);
            addNextEvent(users, index+1);
        });
    }    
}

function addNextEvent(users, index) {
    if(index < users.length) {
        
        if(index + 1 < users.length) {
            $('#modal-next').on('click', {user: users[index + 1]}, function(event) {
                var modal = createModal(event.data.user);
                $('.modal-container').remove();
                $('body').append(modal);
                addPrevEvent(users, index-1);
                addNextEvent(users, index+1);
            });
        }
    }
}

$(document).ready(function(){
    var users = [];
    
    $.ajax({
        url: 'https://randomuser.me/api/?nat=us&results=12',
        dataType: 'json',
        success: function(data) {
            users = data.results;
            users.forEach((user, index) => {
                var card = createCard(user);
                card.on('click', {user: user}, function(event) {
                    var modal = createModal(event.data.user);
                    $('.modal-container').remove();
                    $('body').append(modal);
                    addPrevEvent(users, index);
                    addNextEvent(users, index);
                });
                $('#gallery').append(card);
                
            });
        }
    });

    $('.search-container').append("<form action='#' method='get'>" +
    "<input type='search' id='search-input' class='search-input' placeholder='Search...'>" +
    "<input type='submit' value='&#x1F50D;' id='search-submit' class='search-submit'></form>");


    $('#search-submit').on('click', function(e) {
        e.preventDefault();
        var value = $('#search-input').val();
        if (value) {
            $('.card-name').each(function () {
                
                if (!$(this).text().toLowerCase().includes(value.toLowerCase())) {
                    $(this).parent().parent().hide();
                } else {
                    $(this).parent().parent().show();
                }

            });
        } else {
            $('.card').show();
        }
    });
});