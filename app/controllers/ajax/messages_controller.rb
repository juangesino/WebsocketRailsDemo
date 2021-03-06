module Ajax
  class MessagesController < Ajax::AjaxController
    respond_to :json
    before_action :set_message, only: [:show, :edit, :update, :destroy]

    def index
      @messages = MessageDecorator.decorate_collection(Message.last(10))
      render :json => @messages.to_json(
        :include => {
          :user => {
            :methods => [:image]
          }
        },
        :methods => [:time, :orientation]
      )
    end

    def create
      @message = Message.new(message_params)
      @message.user = current_user
      if @message.save
        WebsocketRails["messages/channels/#{params[:channel_id]}"].trigger('new_message', @message.decorate.as_json(
          :methods => [:time, :orientation],
          :include => {
            :user => {
              :methods => [:image]
            }
          }
        ))
        render :json => {:status => :ok}
      else
        render :json => {status: 'error'}
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_message
        @message = Message.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def message_params
        params.permit(:text, :channel_id)
      end
  end
end
