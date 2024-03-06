from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
import base64

# Imports that should be moved to backend
from mplsoccer import Pitch, Sbopen
import io
# end of these imports
# Create your views here.


class Heatmap(APIView):
    permission_classes = (permissions.AllowAny,)
    print("Reached here")

    def get(self, request):
        parser = Sbopen()
        df_false9 = parser.event(69249)[0]
        df_false9 = df_false9.loc[df_false9.player_id == 5503, ['x', 'y']]
        test_pitch = Pitch(line_color='black', line_zorder=2)
        test_fig, testax = test_pitch.draw(figsize=(10, 5))
        kde = test_pitch.kdeplot(df_false9.x, df_false9.y, ax=testax, fill=True)
        buf = io.BytesIO()
        test_fig.savefig(buf, format='png')
        buf.seek(0)
        heatmap = buf.read() # This is where the function returned in PitchPro main file
        # start of original view file
        res = base64.b64encode(heatmap)
        res = res.decode('utf-8')
        data = "data:image/jpeg;base64," + res
        return Response({'heatmap': data}, status=status.HTTP_200_OK)
