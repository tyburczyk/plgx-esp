#!/bin/bash
echo "Starting docker entry point script..."
cd /src/plgx-esp-ui
echo "Creating enroll file..."
exec `echo "$ENROLL_SECRET">resources/secret.txt`
echo "Waiting for VASP to start..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_ADDRESS -U $POSTGRES_USER -d $POSTGRES_DB_NAME -c "select 1" > /dev/null 2>&1 ; do
  sleep 5
done
echo "Crating tmux sessions..."

exec `tmux new-session -d -s plgx`
exec `tmux new-session -d -s plgx_celery_beat`
exec `tmux new-session -d -s plgx_celery`

TARGET=/usr/local/lib/python3.7/site-packages/celery/backends
cd $TARGET
if [ -e async.py ]
then
    mv async.py asynchronous.py
    sed -i 's/async/asynchronous/g' redis.py
    sed -i 's/async/asynchronous/g' rpc.py
fi

if [[ -z "$IBMxForceKey" ]] || [[ -z "$IBMxForcePass" ]]
then
  echo -e "Ibm credentials are not provided."
  if [[ ! -z "$VT_API_KEY" ]]
  then
    exec `tmux send -t plgx_celery "python manage.py add_api_key --VT_API_KEY $VT_API_KEY" ENTER`
  fi
else
  if [[ -z "$VT_API_KEY" ]]
  then
    exec `tmux send -t plgx_celery "python manage.py add_api_key --IBMxForceKey $IBMxForceKey --IBMxForcePass $IBMxForcePass " ENTER`
  else
    exec `tmux send -t plgx_celery "python manage.py add_api_key --IBMxForceKey $IBMxForceKey --IBMxForcePass $IBMxForcePass --VT_API_KEY $VT_API_KEY" ENTER`	
  fi
fi
echo "Changing directory to plgx-esp-ui..."
cd /src/plgx-esp-ui

echo "Starting celery beat..."
exec `tmux send -t plgx_celery_beat 'celery beat -A polylogyx.worker:celery --schedule=/tmp/celerybeat-schedule --loglevel=INFO --pidfile=/tmp/celerybeaet.pid' ENTER`
echo "Starting PolyLogyx Vasp osquery fleet manager..."
exec `tmux send -t plgx "gunicorn --workers=2 --threads=5  -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker --bind 0.0.0.0:5000 --access-logfile /var/log/gunicorn_access.log --certfile=resources/certificate.crt --keyfile=private.key  manage:app --reload" ENTER`
echo "Starting celery workers..."
exec `tmux send -t plgx_celery "celery worker -A polylogyx.worker:celery --concurrency=2 -l INFO &" ENTER`

echo "PolyLogyx REST API key is : " "$API_KEY"
echo "UI Sever is up and running.."

exec `tail -f /dev/null`
