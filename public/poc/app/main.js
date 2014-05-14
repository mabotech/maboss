


    $('#log').click(function() {
        if ($(this).hasClass('log-max')) {
            $(this).removeClass('log-max');
            var log = document.getElementById('log');
            log.scrollTop = log.scrollHeight;
        } else {
            $(this).addClass('log-max');
        }
    });
    
    
        function logPush(tmpl) {
        var logItem = $('<div />').addClass('log-item');
        $('#log').append(logItem);
        logItem.html(tmpl);

        var log = document.getElementById('log');
        log.scrollTop = log.scrollHeight;

        if ($('#log').children().length > LOG_LIMIT) {
            $('#log').children().eq(0).remove();
        }
    }